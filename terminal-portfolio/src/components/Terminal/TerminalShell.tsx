"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";

import { commandCatalog } from "@/config/commands";
import { themeNames } from "@/config/themes";
import { TerminalEntry, TerminalLine, TerminalMode } from "@/types/terminal";

type TerminalShellProps = {
  history: TerminalEntry[];
  mode: TerminalMode;
  currentInput: string;
  setCurrentInput: (value: string) => void;
  autoTypingText: string;
  isTyping: boolean;
  onSubmit: (value: string) => void;
  embedded?: boolean;
};

const toneClassMap = {
  default: "text-[var(--color-text-primary)]",
  muted: "text-[var(--color-text-secondary)]",
  accent: "text-[var(--color-text-accent)]",
  success: "text-[var(--color-text-success)]",
  error: "text-[var(--color-text-error)]",
};

const autocompleteCommands = [
  ...commandCatalog
    .filter((command) => !command.key.includes("<"))
    .map((command) => command.key),
  ...themeNames.map((name) => `theme set ${name}`),
];

const canAutoFocusInput = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

const renderLine = (
  line: TerminalLine,
  mode: TerminalMode,
  onCommandClick?: (command: string) => void,
) => {
  switch (line.type) {
    case "heading":
      return (
        <p
          className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-text-secondary)]"
        >
          {line.text}
        </p>
      );
    case "text": {
      const toneClass = toneClassMap[line.tone ?? "default"];
      return <p className={`text-sm sm:text-base leading-6 sm:leading-7 ${toneClass}`}>{line.text}</p>;
    }
    case "list":
      return (
        <div className="text-sm sm:text-base leading-6 sm:leading-7 text-[var(--color-text-primary)]">
          {line.title && (
            <p className="font-semibold text-[var(--color-text-accent)]">
              {line.title}
            </p>
          )}
          <ul className="mt-1 space-y-0.5 sm:space-y-1 text-[var(--color-text-secondary)]">
            {line.items.map((item, index) => {
              // Check if this is a help command list item (format: "command        — description")
              // Help items have the pattern: command name (padded) — description
              const trimmedItem = item.trim();
              const isHelpItem = trimmedItem.includes(" — ") && 
                trimmedItem.split(" — ")[0].trim().length > 0;
              
              if (isHelpItem && mode === "interactive" && onCommandClick) {
                // Extract command name (everything before " — ", trimmed)
                const parts = trimmedItem.split(" — ");
                if (parts.length >= 2) {
                  const commandName = parts[0].trim();
                  const description = parts.slice(1).join(" — ");
                  return (
                    <li key={`${item}-${index}`} className="pl-3 sm:pl-4 text-sm sm:text-base">
                      —{" "}
                      <button
                        type="button"
                        onClick={() => onCommandClick(commandName)}
                        className="font-mono text-[var(--color-text-accent)] hover:text-[var(--color-text-primary)] hover:underline cursor-pointer transition-colors"
                      >
                        {commandName}
                      </button>
                      {" — "}
                      <span>{description}</span>
                    </li>
                  );
                }
              }
              return (
                <li key={`${item}-${index}`} className="pl-3 sm:pl-4 text-sm sm:text-base">
                  — {item}
                </li>
              );
            })}
          </ul>
        </div>
      );
    case "columns":
      return (
        <div className="grid gap-3 sm:gap-4 text-sm sm:text-base text-[var(--color-text-primary)] md:grid-cols-2">
          {line.columns.map((column, columnIndex) => (
            <div key={`${column.title}-${columnIndex}`}>
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                {column.title}
              </p>
              <ul className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1 text-[var(--color-text-primary)]">
                {column.items.map((item, itemIndex) => (
                  <li key={`${column.title}-${item}-${itemIndex}`} className="pl-2 sm:pl-3 text-sm sm:text-base">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "link":
      return (
        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] break-words">
          {line.prefix && (
            <span className="text-[var(--color-text-primary)]">{line.prefix}: </span>
          )}
          <a
            href={line.href}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-text-link)] underline decoration-dotted underline-offset-2 sm:underline-offset-4 transition hover:text-[var(--color-text-accent)] break-all"
          >
            {line.label}
          </a>
        </p>
      );
    case "ascii":
      return (
        <pre className="overflow-x-auto whitespace-pre text-[0.45rem] leading-[1.1] text-[var(--color-text-secondary)] sm:text-[0.6rem] md:text-sm sm:leading-normal">
          {line.lines.join("\n")}
        </pre>
      );
    case "spacer":
      return <div className="h-3 sm:h-4" />;
    default:
      return null;
  }
};

export const TerminalShell = ({
  history,
  mode,
  currentInput,
  setCurrentInput,
  autoTypingText,
  isTyping,
  onSubmit,
  embedded = false,
}: TerminalShellProps) => {
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTo({
        top: historyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  useEffect(() => {
    if (mode === "interactive" && inputRef.current && canAutoFocusInput()) {
      inputRef.current.focus();
    }
  }, [mode]);

  const promptValue = mode === "interactive" ? currentInput : autoTypingText;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentInput.trim()) {
      return;
    }
    onSubmit(currentInput);
    setCurrentInput("");
    if (!inputRef.current) {
      return;
    }

    const shell = inputRef.current.closest("[data-terminal-shell]");
    if (canAutoFocusInput()) {
      inputRef.current.focus();
      return;
    }

    inputRef.current.blur();
    requestAnimationFrame(() => {
      if (!inputRef.current) {
        return;
      }
      inputRef.current.blur();
      if (shell) {
        shell.scrollIntoView({ block: "end", behavior: "auto" });
      }
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const trimmed = currentInput.trim();
      if (!trimmed) {
        return;
      }

      // Filter commands that start with the current input
      const matches = autocompleteCommands.filter((cmd) =>
        cmd.toLowerCase().startsWith(trimmed.toLowerCase()),
      );

      if (matches.length > 0) {
        // If there's exactly one match, complete it
        if (matches.length === 1) {
          setCurrentInput(matches[0]);
        } else {
          // If multiple matches, cycle through them or use the first one
          // Find the longest common prefix
          const sortedMatches = matches.sort();
          let commonPrefix = sortedMatches[0];
          for (let i = 1; i < sortedMatches.length; i++) {
            const match = sortedMatches[i];
            let j = 0;
            while (
              j < commonPrefix.length &&
              j < match.length &&
              commonPrefix[j].toLowerCase() === match[j].toLowerCase()
            ) {
              j++;
            }
            commonPrefix = commonPrefix.slice(0, j);
          }
          // If common prefix is longer than current input, use it
          if (commonPrefix.length > trimmed.length) {
            setCurrentInput(commonPrefix);
          } else {
            // Otherwise, use the first match
            setCurrentInput(matches[0]);
          }
        }
      }
    }
  };

  const normalizedInput = currentInput.trim().toLowerCase();
  const autocompleteSuggestion =
    mode === "interactive" && normalizedInput
      ? autocompleteCommands.find(
          (command) =>
            command.toLowerCase().startsWith(normalizedInput) &&
            command.toLowerCase() !== normalizedInput,
        )
      : undefined;
  const autocompleteSuffix =
    autocompleteSuggestion && currentInput.length < autocompleteSuggestion.length
      ? autocompleteSuggestion.slice(currentInput.length)
      : "";

  const handleTerminalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (
      mode === "interactive" &&
      inputRef.current &&
      canAutoFocusInput() &&
      !target.closest("button") &&
      !target.closest("a") &&
      target !== inputRef.current &&
      !inputRef.current.contains(target)
    ) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      data-terminal-shell
      onClick={handleTerminalClick}
      className={
        embedded
          ? "relative flex h-full w-full min-w-0 cursor-text flex-col"
          : "relative flex h-full cursor-text flex-col overflow-hidden rounded-2xl sm:rounded-3xl border p-3 sm:p-4 md:p-6 shadow-2xl backdrop-blur-xl transition"
      }
      style={
        embedded
          ? undefined
          : {
              background: "var(--terminal-bg)",
              borderColor: "var(--terminal-border)",
              boxShadow: "var(--terminal-glow)",
            }
      }
    >
      {!embedded && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full bg-[#ff5f56] flex-shrink-0" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full bg-[#ffbd2e] flex-shrink-0" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full bg-[#27c93f] flex-shrink-0" />
            <p className="ml-2 sm:ml-4 text-[0.65rem] sm:text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)] truncate">
              ~/portfolio
            </p>
          </div>
          <span className="text-[0.65rem] sm:text-xs text-[var(--color-text-secondary)] whitespace-nowrap flex-shrink-0">
            {mode === "interactive" ? "Interactive" : "Scroll Auto Mode"}
          </span>
        </div>
      )}

      <div
        ref={historyRef}
        data-lenis-prevent
        className="mt-4 sm:mt-6 no-scrollbar min-h-0 flex-1 overflow-y-auto pr-1 sm:pr-2 text-sm sm:text-base"
      >
        {history.map((entry) => (
          <div key={entry.id} className="mb-3 sm:mb-4 space-y-2 sm:space-y-3">
            {entry.kind === "command" ? (
              <p className="font-mono text-sm sm:text-base text-[var(--color-text-primary)] break-words">
                <span className="text-[var(--color-text-prompt)]">
                  rutts@workspace
                </span>
                <span className="text-[var(--color-text-secondary)]"> $ </span>
                <span className="break-words">{entry.text}</span>
              </p>
            ) : (
              entry.lines.map((line, index) => {
                // Create a wrapper function that sets input and focuses it
                const handleCommandClick = (command: string) => {
                  onSubmit(command);
                  setCurrentInput("");
                };
                return (
                  <div key={`${entry.id}-${index}`}>
                    {renderLine(line, mode, mode === "interactive" ? handleCommandClick : undefined)}
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 font-mono text-sm sm:text-base text-[var(--color-text-primary)]">
        {mode === "interactive" ? (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sm:gap-3 border-t border-white/10 pt-3 sm:pt-4"
          >
            <span className="text-[var(--color-text-prompt)] whitespace-nowrap text-xs sm:text-sm">
              rutts@workspace
            </span>
            <span className="text-[var(--color-text-secondary)]">$</span>
            <div className="relative min-w-0 flex-1">
              {autocompleteSuffix && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 hidden whitespace-pre font-mono text-xs text-[var(--color-text-secondary)] opacity-55 sm:block sm:text-sm md:text-base"
                >
                  <span className="invisible">{currentInput}</span>
                  <span>{autocompleteSuffix}</span>
                </div>
              )}
              <input
                ref={inputRef}
                value={currentInput}
                onChange={(event) => setCurrentInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="eg: 'about'"
                style={{ fontSize: 16 }}
                className="relative w-full min-w-0 bg-transparent text-base sm:text-sm md:text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]"
              />
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 border-t border-white/5 pt-3 sm:pt-4">
            <span className="text-[var(--color-text-prompt)] whitespace-nowrap text-xs sm:text-sm">
              rutts@workspace
            </span>
            <span className="text-[var(--color-text-secondary)]">$</span>
            <p className="flex-1 min-w-0 min-h-[1.25rem] sm:min-h-[1.5rem] break-words text-xs sm:text-sm md:text-base">
              {promptValue}
              {isTyping && <span className="terminal-cursor ml-1" />}
            </p>
          </div>
        )}
        {mode !== "interactive" && !isTyping && (
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Scroll to reveal sections or click &quot;Interactive Terminal&quot; to type.
          </p>
        )}
      </div>
    </div>
  );
};
