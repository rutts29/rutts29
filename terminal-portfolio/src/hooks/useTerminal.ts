import { useCallback, useMemo, useRef, useState } from "react";

import {
  commandCatalog,
  getHelpLines,
  getInitialSystemOutputs,
  getThemeListLines,
  staticCommandOutputs,
} from "@/config/commands";
import { themeNames } from "@/config/themes";
import type { TerminalEntry, TerminalLine, TerminalMode } from "@/types/terminal";

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

const suggestedCommands = [
  ...commandCatalog
    .filter((command) => !command.key.includes("<"))
    .map((command) => ({
      command: command.key,
      description: command.description,
    })),
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
  const [mode, setMode] = useState<TerminalMode>("boot");
  const [currentInput, setCurrentInput] = useState("");

  const commandLogRef = useRef<string[]>([]);

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

  const runCommand = useCallback(
    async (commandText: string) => {
      const trimmed = commandText.trim();
      if (!trimmed) {
        return;
      }

      commandLogRef.current.push(trimmed);

      const normalized = trimmed.toLowerCase();

      if (normalized === "clear") {
        commandLogRef.current = [];
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
                type: "command-list",
                items: [suggestion],
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
      themeName,
    ],
  );

  const enterInteractiveMode = useCallback(() => {
    setHistory(createInteractiveHistory());
    commandLogRef.current = ["help"];
    setCurrentInput("");
    setMode("interactive");
  }, []);

  return useMemo(
    () => ({
      history,
      mode,
      currentInput,
      setCurrentInput,
      runCommand,
      enterInteractiveMode,
    }),
    [history, mode, currentInput, runCommand, enterInteractiveMode],
  );
};
