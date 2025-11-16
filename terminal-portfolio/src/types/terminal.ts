export type TerminalLine =
  | {
      type: "text";
      text: string;
      tone?: "default" | "muted" | "accent" | "success" | "error";
    }
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "list";
      title?: string;
      items: string[];
    }
  | {
      type: "columns";
      columns: Array<{
        title: string;
        items: string[];
      }>;
    }
  | {
      type: "link";
      label: string;
      href: string;
      prefix?: string;
    }
  | {
      type: "ascii";
      lines: string[];
    }
  | {
      type: "spacer";
    };

export type CommandDefinition = {
  key: string;
  description: string;
  output: TerminalLine[];
};

export type TerminalEntry =
  | {
      id: string;
      kind: "system";
      lines: TerminalLine[];
    }
  | {
      id: string;
      kind: "command";
      text: string;
    }
  | {
      id: string;
      kind: "output";
      lines: TerminalLine[];
    };

export type TerminalMode = "scrollAuto" | "interactive";

