import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  commandCatalog,
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

const createInteractiveHistory = (): TerminalEntry[] => {
  const base = createInitialHistory();
  const bootCommands: Array<{ command: string; output: TerminalLine[] }> = [
    { command: "help", output: getHelpLines() },
  ];

  const entries = [...base];

  bootCommands.forEach(({ command, output }) => {
    entries.push({
      id: createEntryId(),
      kind: "command",
      text: command,
    });
    entries.push({
      id: createEntryId(),
      kind: "output",
      lines: output,
    });
  });

  return entries;
};

const TYPING_DELAY = 45;
const suggestedCommands = [
  ...commandCatalog
    .filter((command) => !command.key.includes("<"))
    .map((command) => ({
      command: command.key,
      description: command.description,
    })),
  { command: "commands", description: "List available commands" },
  ...themeNames.map((name) => ({
    command: `theme set ${name}`,
    description: `Switch to ${name}`,
  })),
];

const getEditDistance = (a: string, b: string) => {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      current[j] =
        a[i - 1] === b[j - 1]
          ? previous[j - 1]
          : Math.min(previous[j - 1], previous[j], current[j - 1]) + 1;
    }
    for (let j = 0; j <= b.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[b.length];
};

const getClosestCommand = (input: string) => {
  if (input.length < 2) {
    return undefined;
  }

  const [best] = suggestedCommands
    .map((suggestion) => ({
      ...suggestion,
      distance: getEditDistance(input, suggestion.command),
    }))
    .sort((a, b) => a.distance - b.distance);
  const threshold = Math.max(2, Math.floor(input.length * 0.35));
  return best.distance <= threshold ? best : undefined;
};

export const useTerminal = ({
  onThemeChange,
  themeName,
}: UseTerminalOptions) => {
  const [history, setHistory] = useState<TerminalEntry[]>(createInitialHistory);
  const [mode, setMode] = useState<TerminalMode>("scrollAuto");
  const [currentInput, setCurrentInput] = useState("");
  const [autoTypingText, setAutoTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
        if (!target.length || target === "<name>") {
          appendOutputEntry(getThemeListLines(themeName));
          return;
        }

        if (!themeNames.includes(target)) {
          appendOutputEntry([
            {
              type: "text",
              text: `Theme "${target}" not found. Pick one below.`,
              tone: "error",
            },
            ...getThemeListLines(themeName),
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

      const suggestion = getClosestCommand(normalized);
      appendOutputEntry(
        suggestion
          ? [
              {
                type: "text",
                text: `Unknown command "${trimmed}". Did you mean?`,
                tone: "error",
              },
              {
                type: "list",
                items: [`${suggestion.command} — ${suggestion.description}`],
              },
            ]
          : [
              {
                type: "text",
                text: `Unknown command "${trimmed}". Type \`help\` to see options.`,
                tone: "error",
              },
            ],
      );
    },
    [
      appendCommandEntry,
      appendOutputEntry,
      onThemeChange,
      resolveStaticOutput,
      simulateTyping,
      themeName,
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

  const enterInteractiveMode = useCallback(() => {
    setHistory(createInteractiveHistory());
    commandLogRef.current = ["about", "help"];
    queueRef.current = Promise.resolve();
    clearTypingTimeout();
    setIsTyping(false);
    setAutoTypingText("");
    setCurrentInput("");
    setMode("interactive");
  }, []);

  const terminalState = useMemo(
    () => ({
      history,
      mode,
      currentInput,
      setCurrentInput,
      isTyping,
      autoTypingText,
      runCommand,
      enqueueAutoCommand,
      enterInteractiveMode,
    }),
    [
      history,
      mode,
      currentInput,
      isTyping,
      autoTypingText,
      runCommand,
      enqueueAutoCommand,
      enterInteractiveMode,
    ],
  );

  return terminalState;
};
