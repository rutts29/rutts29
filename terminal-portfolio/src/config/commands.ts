import { themeNames } from "@/config/themes";
import { CommandDefinition, TerminalLine } from "@/types/terminal";

export const commandCatalog: CommandDefinition[] = [
  { key: "help", description: "List available commands", output: [] },
  { key: "about", description: "Who I am and what I do", output: [] },
  { key: "education", description: "Where I studied", output: [] },
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
        "██████╗ ██╗   ██╗████████╗████████╗███████╗",
        "██╔══██╗██║   ██║╚══██╔══╝╚══██╔══╝██╔════╝",
        "██████╔╝██║   ██║   ██║      ██║   ███████╗",
        "██╔══██╗██║   ██║   ██║      ██║   ╚════██║",
        "██║  ██║╚██████╔╝   ██║      ██║   ███████║",
        "╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═╝   ╚══════╝",
        "",
        "Welcome to Rutts' interactive workspace.",
      ],
    },
  ],
  welcome: [
    {
      type: "text",
      text: "yoo, I'm Rutts (Ruttansh Bhatelia) — Toronto-based AI engineer shipping secure copilots and automation.",
      tone: "accent",
    },
    {
      type: "text",
      text: "Scroll through the showcase or unlock interactive mode to run every command yourself.",
      tone: "muted",
    },
  ],
  about: [
    { type: "heading", text: "About" },
    {
      type: "text",
      text: "I'm Ruttansh (Rutts) Bhatelia. I build production-ready AI/ML tooling that mixes rigorous research with practical engineering across security, code intelligence, and automation.",
    },
    {
      type: "text",
      text: "My work covers vulnerability-aware copilots, RAG-enhanced workflows, and inference/training pipelines that prioritize reliability and observability.",
    },
    {
      type: "text",
      text: "I hold an Honours BSc in Computer Science (Data Analytics) and stay engaged with applied research partners to keep sharpening the stack.",
    },
  ],
  education: [
    { type: "heading", text: "Education" },
    {
      type: "text",
      text: "Honours Bachelor of Science in Computer Science (Data Analytics)",
    },
    {
      type: "text",
      text: "Graduated 2025 · Toronto, Ontario · Focused on applied AI, data engineering, and collaborating with applied research programs.",
      tone: "muted",
    },
  ],
  skills: [
    { type: "heading", text: "Skills" },
    {
      type: "columns",
      columns: [
        {
          title: "Programming & Systems",
          items: [
            "Python",
            "C#",
            "JavaScript / TypeScript",
            "C / C++",
            "Scala",
            "R",
            "Java",
            "Linux",
          ],
        },
        {
          title: "Web & Cloud",
          items: [
            "HTML",
            "CSS",
            "Node.js",
            "Next.js",
            "React",
            "Flutter",
            "Azure",
            "Google Cloud",
            "AWS",
          ],
        },
        {
          title: "Data Science",
          items: [
            "TensorFlow",
            "PyTorch",
            "Transformers",
            "Pandas",
            "NumPy",
            "Spark",
            "Tableau",
            "Power BI",
            "Fume",
          ],
        },
        {
          title: "Tools & Practices",
          items: [
            "SQL",
            "MongoDB",
            "Hadoop",
            "Docker",
            "Git",
            "JIRA",
            "SCRUM",
            "Data Structures",
            "Algorithms",
            ".NET Core",
          ],
        },
      ],
    },
  ],
  experience: [
    { type: "heading", text: "Experience" },
    {
      type: "text",
      text: "CredShields — AI Engineer & ML Researcher · Contract / Remote (Singapore · Oakville)",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Led end-to-end AI/ML pipelines that detect smart contract vulnerabilities with LLM-assisted reasoning.",
        "Built RAG-enabled workflows and custom knowledge bases to amplify code analysis copilots.",
        "Finetuned PyTorch/Hugging Face models with prompt tuning for few-/zero-shot vulnerability queries.",
        "Created ML modules for feature extraction, anomaly detection, and fix recommendation scoring.",
      ],
    },
    { type: "spacer" },
    {
      type: "text",
      text: "TELUS — Machine Learning Researcher (Indoor Localization using Gen AI) · Contract, Oakville",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Architected a generative-AI indoor localization system in collaboration with applied research teams.",
        "Synthesized RSSI data with VAEs to auto-generate virtual fingerprints and skip manual surveys.",
        "Validated nearest-neighbor regression on 2D layouts to achieve high-precision positioning.",
      ],
    },
    { type: "spacer" },
    {
      type: "text",
      text: "McMaster University — Full Stack Developer, Cross Platform · Contract",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Ported a web application into a Flutter-powered iOS/Android experience in partnership with applied AI researchers.",
        "Enhanced UX, enforced GDPR/HIPAA compliance, and integrated Strapi + SQL backends.",
        "Drove iterative improvements through Figma prototypes, REST APIs, and Git-based review cycles.",
      ],
    },
    { type: "spacer" },
    {
      type: "text",
      text: "Osteoporosis Canada — Machine Learning Researcher · Co-op",
      tone: "accent",
    },
    {
      type: "list",
      items: [
        "Collaborated with Naryant and research partners on ML efforts to predict imminent fracture risk.",
        "Engineered features, trained soft-voting ensembles, and lifted accuracy by 30–40%.",
        "Documented findings for stakeholders and internal knowledge sharing.",
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
      text: "Location: Toronto, Ontario · Open to relocate",
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


