"use client";

import { FormEvent, useEffect, useMemo, useRef } from "react";

import { TerminalEntry, TerminalLine, TerminalMode } from "@/types/terminal";

type TerminalShellProps = {
  history: TerminalEntry[];
  mode: TerminalMode;
  currentInput: string;
  setCurrentInput: (value: string) => void;
  autoTypingText: string;
  isTyping: boolean;
  onSubmit: (value: string) => void;
};

const toneClassMap = {
  default: "text-[var(--color-text-primary)]",
  muted: "text-[var(--color-text-secondary)]",
  accent: "text-[var(--color-text-accent)]",
  success: "text-[var(--color-text-success)]",
  error: "text-[var(--color-text-error)]",
};

const renderLine = (line: TerminalLine) => {
  switch (line.type) {
    case "heading":
      return (
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-text-secondary)]"
        >
          {line.text}
        </p>
      );
    case "text": {
      const toneClass = toneClassMap[line.tone ?? "default"];
      return <p className={`text-sm leading-6 ${toneClass}`}>{line.text}</p>;
    }
    case "list":
      return (
        <div className="text-sm leading-6 text-[var(--color-text-primary)]">
          {line.title && (
            <p className="font-semibold text-[var(--color-text-accent)]">
              {line.title}
            </p>
          )}
          <ul className="mt-1 space-y-1 text-[var(--color-text-secondary)]">
            {line.items.map((item, index) => (
              <li key={`${item}-${index}`} className="pl-4 text-sm">
                — {item}
              </li>
            ))}
          </ul>
        </div>
      );
    case "columns":
      return (
        <div className="grid gap-4 text-sm text-[var(--color-text-primary)] md:grid-cols-2">
          {line.columns.map((column, columnIndex) => (
            <div key={`${column.title}-${columnIndex}`}>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                {column.title}
              </p>
              <ul className="mt-2 space-y-1 text-[var(--color-text-primary)]">
                {column.items.map((item, itemIndex) => (
                  <li key={`${column.title}-${item}-${itemIndex}`} className="pl-3 text-sm">
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
        <p className="text-sm text-[var(--color-text-secondary)]">
          {line.prefix && (
            <span className="text-[var(--color-text-primary)]">{line.prefix}: </span>
          )}
          <a
            href={line.href}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-text-link)] underline decoration-dotted underline-offset-4 transition hover:text-[var(--color-text-accent)]"
          >
            {line.label}
          </a>
        </p>
      );
    case "ascii":
      return (
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-[var(--color-text-secondary)]">
          {line.lines.join("\n")}
        </pre>
      );
    case "spacer":
      return <div className="h-4" />;
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
    if (mode === "interactive" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const promptValue = useMemo(
    () => (mode === "interactive" ? currentInput : autoTypingText),
    [autoTypingText, currentInput, mode],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentInput.trim()) {
      return;
    }
    onSubmit(currentInput);
    setCurrentInput("");
  };

  return (
    <div
      className="rounded-3xl border p-6 shadow-2xl backdrop-blur-xl transition"
      style={{
        background: "var(--terminal-bg)",
        borderColor: "var(--terminal-border)",
        boxShadow: "var(--terminal-glow)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <p className="ml-4 text-xs uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
            ~/portfolio
          </p>
        </div>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {mode === "interactive" ? "Interactive" : "Scroll Auto Mode"}
        </span>
      </div>

      <div
        ref={historyRef}
        className="mt-6 h-[420px] overflow-y-auto pr-2 text-sm"
      >
        {history.map((entry) => (
          <div key={entry.id} className="mb-4 space-y-3">
            {entry.kind === "command" ? (
              <p className="font-mono text-sm text-[var(--color-text-primary)]">
                <span className="text-[var(--color-text-prompt)]">
                  rutts@workspace
                </span>
                <span className="text-[var(--color-text-secondary)]"> $ </span>
                {entry.text}
              </p>
            ) : (
              entry.lines.map((line, index) => (
                <div key={`${entry.id}-${index}`}>{renderLine(line)}</div>
              ))
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 font-mono text-sm text-[var(--color-text-primary)]">
        {mode === "interactive" ? (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-white/10 pt-4"
          >
            <span className="text-[var(--color-text-prompt)]">
              rutts@workspace
            </span>
            <span className="text-[var(--color-text-secondary)]">$</span>
            <input
              ref={inputRef}
              value={currentInput}
              onChange={(event) => setCurrentInput(event.target.value)}
              placeholder="Type a command (try `projects`)"
              className="flex-1 bg-transparent text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]"
            />
          </form>
        ) : (
          <div className="flex items-center gap-3 border-t border-white/5 pt-4">
            <span className="text-[var(--color-text-prompt)]">
              rutts@workspace
            </span>
            <span className="text-[var(--color-text-secondary)]">$</span>
            <p className="flex-1 min-h-[1.5rem]">
              {promptValue}
              {isTyping && <span className="terminal-cursor ml-1" />}
            </p>
          </div>
        )}
        {mode !== "interactive" && !isTyping && (
          <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
            Scroll to reveal sections or click “Interactive Terminal” to type.
          </p>
        )}
      </div>
    </div>
  );
};

