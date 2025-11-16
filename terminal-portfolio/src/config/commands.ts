import { themeNames } from "@/config/themes";
import { CommandDefinition, TerminalLine } from "@/types/terminal";

export const commandCatalog: CommandDefinition[] = [
  { key: "help", description: "List available commands", output: [] },
  { key: "about", description: "Who I am and what I do", output: [] },
  { key: "skills", description: "Stacks, languages, and tooling", output: [] },
  { key: "experience", description: "Roles and impact", output: [] },
  { key: "projects", description: "Highlighted builds and repos", output: [] },
  { key: "contact", description: "How to reach me", output: [] },
  { key: "theme list", description: "Show supported themes", output: [] },
  {
    key: "theme set <name>",
    description: "Switch the terminal theme",
    output: [],
  },
  { key: "clear", description: "Reset the terminal history", output: [] },
  { key: "history", description: "Show recent commands", output: [] },
  { key: "banner", description: "Print the ASCII welcome banner", output: [] },
];

export const staticCommandOutputs: Record<string, TerminalLine[]> = {
  banner: [
    {
      type: "ascii",
      lines: [
        " ____        _       _            ",
        "|  _ \\ _   _| |_ ___| |_ ___  ___ ",
        "| |_) | | | | __/ __| __/ _ \\/ __|",
        "|  _ <| |_| | |_\\__ \\ ||  __/\\__ \\",
        "|_| \\_\\\\__,_|\\__|___/\\__\\___||___/",
        "",
        "Welcome to Rutts' interactive workspace.",
      ],
    },
  ],
  welcome: [
    {
      type: "text",
      text: "Type `help` to explore commands or scroll to auto-play the story.",
      tone: "accent",
    },
    {
      type: "text",
      text: "You can toggle themes, run commands manually, or let the timeline handle it.",
      tone: "muted",
    },
  ],
  about: [
    { type: "heading", text: "About" },
    {
      type: "text",
      text: "I'm Rutts — an AI engineer focused on code intelligence, smart contract security, and full stack AI systems.",
    },
    {
      type: "text",
      text: "I design and ship production-grade tooling that blends LLM research with practical infrastructure for secure automation.",
    },
    {
      type: "text",
      text: "Currently building vulnerability-aware copilots, agentic workflows, and optimized inference/training pipelines.",
    },
  ],
  skills: [
    { type: "heading", text: "Skills" },
    {
      type: "columns",
      columns: [
        {
          title: "Core Stack",
          items: ["AI Engineering", "LLM Agents", "Security", "Web3"],
        },
        {
          title: "Languages",
          items: ["Python", "TypeScript", "Rust", "Solidity", "C++"],
        },
        {
          title: "Frameworks",
          items: [
            "Next.js",
            "React",
            "FastAPI",
            "Django",
            "PyTorch",
            "Transformers",
          ],
        },
        {
          title: "Tools & Platforms",
          items: [
            "vLLM",
            "Unsloth",
            "DeepSpeed",
            "AWS",
            "Docker",
            "Vercel",
          ],
        },
      ],
    },
  ],
  experience: [
    { type: "heading", text: "Experience" },
    {
      type: "text",
      text: "0xSecurity — Lead AI Security Engineer (2024 — Present)",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Shipped LLM-powered audits covering Solidity + Rust smart contracts.",
        "Trained vulnerability reasoning models with long-context agents.",
        "Owned infra for multi-model inference across GPU + serverless.",
      ],
    },
    { type: "spacer" },
    {
      type: "text",
      text: "Autonomi Labs — Founding AI Engineer (2022 — 2024)",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Built secure code copilots for enterprise teams.",
        "Implemented RAG pipelines with custom embeddings and governance.",
        "Scaled evaluation harnesses for agent workflows.",
      ],
    },
    { type: "spacer" },
    {
      type: "text",
      text: "Freelance — AI/ML Consultant",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Delivered ML systems for fintech, gaming, and infra clients.",
        "Set up observability stacks and cost-optimized deployments.",
      ],
    },
  ],
  projects: [
    { type: "heading", text: "Projects" },
    {
      type: "text",
      text: "SentinelCopilot — LLM agent that triages Solidity + Rust smart contracts.",
    },
    {
      type: "text",
      text: "Stack: vLLM, LangGraph, PostgreSQL, Foundry, Rust",
      tone: "muted",
    },
    {
      type: "link",
      label: "github.com/rutts29/sentinel-copilot",
      href: "https://github.com/rutts29/sentinel-copilot",
      prefix: "Repo",
    },
    { type: "spacer" },
    {
      type: "text",
      text: "ForgeTrace — production-ready pipeline for secure code search + diffing.",
    },
    {
      type: "text",
      text: "Stack: Next.js, OpenSearch, LangChain, Supabase",
      tone: "muted",
    },
    {
      type: "link",
      label: "github.com/rutts29/forgetrace",
      href: "https://github.com/rutts29/forgetrace",
      prefix: "Repo",
    },
    { type: "spacer" },
    {
      type: "text",
      text: "AtlasOps — autonomous infra agent orchestrating GPU workloads.",
    },
    {
      type: "text",
      text: "Stack: Go, Python, Temporal, Kubernetes, Grafana",
      tone: "muted",
    },
    {
      type: "link",
      label: "github.com/rutts29/atlas-ops",
      href: "https://github.com/rutts29/atlas-ops",
      prefix: "Repo",
    },
  ],
  contact: [
    { type: "heading", text: "Contact" },
    {
      type: "link",
      label: "rutts291@gmail.com",
      href: "mailto:rutts291@gmail.com",
      prefix: "Email",
    },
    {
      type: "link",
      label: "linkedin.com/in/ruttansh-bhatelia",
      href: "https://www.linkedin.com/in/ruttansh-bhatelia",
      prefix: "LinkedIn",
    },
    {
      type: "link",
      label: "github.com/rutts29",
      href: "https://github.com/rutts29",
      prefix: "GitHub",
    },
    {
      type: "text",
      text: "Location: Bangalore ↔ Remote",
      tone: "muted",
    },
  ],
};

export const getHelpLines = (): TerminalLine[] => [
  { type: "heading", text: "Available Commands" },
  {
    type: "list",
    items: commandCatalog.map(
      (command) => `${command.key.padEnd(16, " ")} — ${command.description}`,
    ),
  },
];

export const getThemeListLines = (activeTheme?: string): TerminalLine[] => [
  { type: "heading", text: "Themes" },
  {
    type: "list",
    items: themeNames.map((name) =>
      name === activeTheme ? `${name}  ← current` : name,
    ),
  },
];

export const getInitialSystemOutputs = () => [
  staticCommandOutputs.banner,
  staticCommandOutputs.welcome,
];

