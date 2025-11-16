import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  getHelpLines,
  getInitialSystemOutputs,
  getThemeListLines,
  staticCommandOutputs,
} from "@/config/commands";
import { themeNames } from "@/config/themes";
import { TerminalEntry, TerminalLine, TerminalMode } from "@/types/terminal";

type UseTerminalOptions = {
  themeName: string;
  onThemeChange: (name: string) => void;
};

const createEntryId = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    return `entry-${counter}`;
  };
})();

const createInitialHistory = (): TerminalEntry[] =>
  getInitialSystemOutputs().map((lines, index) => ({
    id: `system-${index}`,
    kind: "system" as const,
    lines,
  }));

const TYPING_DELAY = 45;

export const useTerminal = ({
  onThemeChange,
  themeName,
}: UseTerminalOptions) => {
  const [history, setHistory] = useState<TerminalEntry[]>(createInitialHistory);
  const [mode, setMode] = useState<TerminalMode>("scrollAuto");
  const [currentInput, setCurrentInput] = useState("");
  const [autoTypingText, setAutoTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const commandLogRef = useRef<string[]>([]);
  const queueRef = useRef(Promise.resolve());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearTypingTimeout(), []);

  const simulateTyping = useCallback(
    (command: string) =>
      new Promise<void>((resolve) => {
        if (!command.length) {
          resolve();
          return;
        }
        setIsTyping(true);
        setAutoTypingText("");
        let index = 0;

        const typeNext = () => {
          setAutoTypingText(command.slice(0, index + 1));
          index += 1;

          if (index >= command.length) {
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
              setAutoTypingText("");
              resolve();
            }, TYPING_DELAY * 2);
            return;
          }

          typingTimeoutRef.current = setTimeout(typeNext, TYPING_DELAY);
        };

        typingTimeoutRef.current = setTimeout(typeNext, TYPING_DELAY);
      }),
    [],
  );

  const appendEntry = useCallback((entry: TerminalEntry) => {
    setHistory((prev) => [...prev, entry]);
  }, []);

  const appendCommandEntry = useCallback(
    (text: string) => {
      appendEntry({
        id: createEntryId(),
        kind: "command",
        text,
      });
    },
    [appendEntry],
  );

  const appendOutputEntry = useCallback(
    (lines: TerminalLine[]) => {
      appendEntry({
        id: createEntryId(),
        kind: "output",
        lines,
      });
    },
    [appendEntry],
  );

  const getHistoryLines = useCallback((): TerminalLine[] => {
    const recent = commandLogRef.current.slice(-8);
    if (!recent.length) {
      return [
        { type: "heading", text: "History" },
        { type: "text", text: "No commands yet.", tone: "muted" },
      ];
    }

    return [
      { type: "heading", text: "History" },
      {
        type: "list",
        items: recent.map((command, index) => {
          const startIndex =
            commandLogRef.current.length - recent.length + index + 1;
          return `${startIndex}. ${command}`;
        }),
      },
    ];
  }, []);

  const resolveStaticOutput = useCallback(
    (normalized: string): TerminalLine[] | null => {
      if (normalized === "help" || normalized === "commands") {
        return getHelpLines();
      }
      if (normalized === "history") {
        return getHistoryLines();
      }
      if (normalized === "theme list") {
        return getThemeListLines(themeName);
      }
      return staticCommandOutputs[normalized] ?? null;
    },
    [getHistoryLines, themeName],
  );

  const executeCommand = useCallback(
    async (commandText: string, opts?: { simulateTyping?: boolean }) => {
      const trimmed = commandText.trim();
      if (!trimmed) {
        return;
      }

      if (opts?.simulateTyping) {
        await simulateTyping(trimmed);
      }

      commandLogRef.current.push(trimmed);

      const normalized = trimmed.toLowerCase();

      if (normalized === "clear") {
        setHistory(createInitialHistory());
        return;
      }

      appendCommandEntry(trimmed);

      if (normalized.startsWith("theme set")) {
        const target = normalized.replace("theme set", "").trim();
        if (!target.length) {
          appendOutputEntry([
            {
              type: "text",
              text: "Specify a theme name e.g. `theme set monokai`.",
              tone: "error",
            },
          ]);
          return;
        }

        if (!themeNames.includes(target)) {
          appendOutputEntry([
            {
              type: "text",
              text: `Theme "${target}" not found. Try \`theme list\`.`,
              tone: "error",
            },
          ]);
          return;
        }

        onThemeChange(target);
        appendOutputEntry([
          {
            type: "text",
            text: `Theme set to "${target}".`,
            tone: "success",
          },
        ]);
        return;
      }

      const staticOutput = resolveStaticOutput(normalized);

      if (staticOutput) {
        appendOutputEntry(staticOutput);
        return;
      }

      appendOutputEntry([
        {
          type: "text",
          text: `Unknown command "${trimmed}". Type \`help\` to see options.`,
          tone: "error",
        },
      ]);
    },
    [
      appendCommandEntry,
      appendOutputEntry,
      onThemeChange,
      resolveStaticOutput,
      simulateTyping,
    ],
  );

  const runCommand = useCallback(
    (command: string) => executeCommand(command, { simulateTyping: false }),
    [executeCommand],
  );

  const enqueueAutoCommand = useCallback(
    (command: string) => {
      queueRef.current = queueRef.current.then(() =>
        executeCommand(command, { simulateTyping: true }),
      );
      return queueRef.current;
    },
    [executeCommand],
  );

  const toggleSound = useCallback(
    () => setSoundEnabled((prev) => !prev),
    [],
  );

  const terminalState = useMemo(
    () => ({
      history,
      mode,
      setMode,
      currentInput,
      setCurrentInput,
      isTyping,
      autoTypingText,
      runCommand,
      enqueueAutoCommand,
      soundEnabled,
      toggleSound,
    }),
    [
      history,
      mode,
      setMode,
      currentInput,
      isTyping,
      autoTypingText,
      runCommand,
      enqueueAutoCommand,
      soundEnabled,
      toggleSound,
    ],
  );

  return terminalState;
};

