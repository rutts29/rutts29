export type PortfolioLink = {
  label: string;
  href: string;
  prefix?: string;
};

export type SkillItem = {
  label: string;
  /** shields.io-style badge in /public/badges and its native width. */
  badgeSrc: string;
  badgeWidth: number;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export type ExperienceRole = {
  company: PortfolioLink;
  unit?: PortfolioLink;
  partner?: PortfolioLink;
  role: string;
  duration: string;
  details: string[];
  isCurrent?: boolean;
  relatedLinks?: PortfolioLink[];
};

export type Project = {
  id: string;
  name: string;
  placement: "selected" | "additional" | "more" | "research";
  /** Chip next to the name; "waiting" tones it amber instead of cyan. */
  status?: { label: string; tone: "now" | "waiting" };
  summary: string;
  description?: string;
  stack: string[];
  links?: PortfolioLink[];
};

export type WritingItem = {
  id: string;
  title: string;
  summary: string;
  meta: string;
  links: PortfolioLink[];
};

export type ContactKind = "email" | "linkedin" | "github";

export type ContactLink = {
  label: string;
  href: string;
  icon: ContactKind;
};

export const contactKindLabels: Record<ContactKind, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
};

/** Section copy shared by the visible page and its Markdown representation. */
export const portfolioSections = {
  story: { label: "Story", title: "How I got here" },
  work: {
    label: "Selected work",
    title: "Applied AI systems",
    intro: "Observability and control systems that make AI-assisted engineering easier to inspect, steer, and improve.",
  },
  thinking: { label: "Thinking", title: "How I think about AI" },
  next: { label: "Next", title: "What's next" },
  focus: {
    label: "Skills",
    title: "Stack",
    intro: "A focused view of the technologies I use to build and ship.",
  },
  writing: {
    label: "Publications",
    title: "Published research",
    intro: "Peer-reviewed work, with concise technical articles to follow.",
  },
  research: { label: "Research project", title: "Undergraduate thesis" },
};

export type StoryRole = {
  title: string;
  org: PortfolioLink;
  partner?: PortfolioLink;
  dates: string;
  /** Extra links shown after the dates, e.g. a paper or product. */
  links?: PortfolioLink[];
};

export type StoryChapter = {
  meta: string;
  lead: string;
  body: string;
  highlights?: string[];
  roles: StoryRole[];
};

export type PortfolioContent = {
  siteUrl: string;
  resume: {
    isPublished: boolean;
    label: string;
    pagePath: string;
    documentPath: string;
    downloadName: string;
    assetUrl: string;
  };
  identity: {
    name: string;
    shortName: string;
    handle: string;
    title: string;
    metaDescription: string;
    /** Hero copy: a headline, two short paragraphs, and one personal line. */
    headline: string;
    hero: string;
    heroDetail: string;
    personal: string;
    about: string[];
    specialties: string[];
    education: {
      degree: string;
      detail: string;
    };
  };
  proofFacts: Array<{ label: string; value: string }>;
  projects: Project[];
  skills: SkillGroup[];
  experience: ExperienceRole[];
  writing: WritingItem[];
  /** First-person story used by the plain look (/plain). */
  story: {
    chapters: StoryChapter[];
    thinking: string[];
    next: string[];
    contactInvite: string;
  };
  contact: {
    heading: string;
    intro: string;
    links: ContactLink[];
    emailCta: {
      label: string;
      mailto: string;
    };
  };
};

export const portfolioContent: PortfolioContent = {
  siteUrl: "https://www.0xrutts.com",
  resume: {
    isPublished: true,
    label: "Resume",
    pagePath: "/resume",
    documentPath: "/resume/document",
    downloadName: "Ruttansh Bhatelia - Applied AI Resume.pdf",
    assetUrl:
      "https://ct1hcdcf6m57dpui.public.blob.vercel-storage.com/ruttansh-resume.pdf",
  },
  identity: {
    name: "Ruttansh Bhatelia",
    shortName: "Rutts",
    handle: "0xRutts",
    title: "Applied AI Engineer",
    metaDescription:
      "Applied AI Engineer. I build the systems around models: agent harnesses, orchestration, and evaluation-minded controls so AI work is reliable and reviewable.",
    headline: "Curious by default. Rigorous in practice.",
    hero:
      "I'm an AI engineer who needs to know why things are the way they are. Sometimes that's curiosity about something new. Sometimes it's a problem I can't let go of. Either way, my agents and I dig in until it's fixed for good.",
    heroDetail:
      "When I'm not on my server building, breaking and fixing things, I'm on X catching new releases early and spotting problems worth solving with AI.",
    personal: "Otherwise, I'm watching Suits or The Mentalist. Again.",
    about: [
      "My work spans secure agentic systems, developer and security tooling, and applied machine learning.",
      "I work in Python, Rust and TypeScript.",
    ],
    specialties: [
      "Applied AI",
      "Agentic systems",
      "Systems design",
      "Machine learning",
      "LLM applications",
      "Harness engineering",
      "AI security tooling",
      "Agent infrastructure",
      "Sandboxing",
      "Agent evaluation",
    ],
    education: {
      degree: "Honours Bachelor of Science in Computer Science, Sheridan College",
      detail:
        "Specialization in Data Analytics & Machine Learning · Jan 2022 – Dec 2025",
    },
  },

  proofFacts: [
    { label: "Education", value: "Honours BSc in Computer Science" },
    {
      label: "Now",
      value:
        "Applied AI engineer building supervision, sandboxing and evaluation for coding agents",
    },
    { label: "Published at", value: "IEEE MSWiM 2025" },
  ],

  projects: [
    {
      id: "keeping-agents-honest",
      name: "Keeping Agents Honest (kah)",
      placement: "selected",
      summary:
        "A supervisor for unmodified Claude Code and Codex. It records the developer's instructions word for word, checks every commit against them, and corrects the agent mid-task.",
      description:
        "Third-party repo commands run in gVisor sandboxes on a VPS with no nested virtualization, where microVMs like Firecracker can't run. In a 31-commit replay, kah's commit screen escalated 7 of 8 planted violations with 0 of 23 normal commits flagged. On real work (safetensors #878), kah caught three defects in Codex's commits, each fixed in the next commit. Built solo, end to end.",
      stack: ["Rust", "gVisor", "Claude Code", "Codex"],
      links: [
        {
          label: "github.com/rutts29/keeping-agents-honest",
          href: "https://github.com/rutts29/keeping-agents-honest",
          prefix: "GitHub",
        },
        {
          label: "Case study",
          href: "https://claude.ai/artifact/FH7Z6LcgcEcdKGEY9S689h#overview",
          prefix: "Case study",
        },
      ],
    },
    {
      id: "agent-hub",
      name: "Agent Hub",
      placement: "selected",
      summary:
        "An always-on agent platform. A coordinator agent with file-based memory picks the model for each job and dispatches work to cloud workers, an always-on server or a private local lane.",
      description:
        "An exit gateway built into Claude Code's and Codex's own permission layer checks every outward action before it runs.",
      stack: ["Claude Projects", "Claude Code", "T3 Code", "MCP", "Tailscale"],
    },
    {
      id: "agentlog",
      name: "agentlog",
      placement: "selected",
      summary:
        "A local observability workspace that shows what AI coding agents did, where sessions broke down, and which working patterns recur across projects and tools.",
      description:
        "I built read-only adapters for seven coding tools (Codex CLI, Claude Code, Cursor, Warp, Hermes, T3 Code, Grok), source-verified session analysis, and reviewable suggestions for improving AGENTS.md and skill files without changing them automatically.",
      stack: ["Python", "TypeScript", "SQLite", "MCP"],
      links: [
        {
          label: "github.com/rutts29/agentlog",
          href: "https://github.com/rutts29/agentlog",
          prefix: "GitHub",
        },
      ],
    },
    {
      id: "driftbench",
      name: "DriftBench",
      placement: "selected",
      status: { label: "In progress", tone: "now" },
      summary:
        "An open benchmark for drift in long coding-agent sessions, with cross-provider judges and a headless runner anyone can rerun.",
      stack: [],
    },
    {
      id: "driftctl",
      name: "driftctl",
      placement: "additional",
      summary:
        "The Codex continuity layer that grew into Keeping Agents Honest.",
      description:
        "I built source-linked intent tracking and deterministic conflict checks, so accepted goals and later instructions survive compaction while ambiguous changes return to the user for review.",
      stack: ["Rust", "Codex hooks"],
      links: [
        {
          label: "github.com/rutts29/driftctl",
          href: "https://github.com/rutts29/driftctl",
          prefix: "GitHub",
        },
      ],
    },
    {
      id: "cutoff",
      name: "Cutoff",
      placement: "additional",
      summary:
        "A restaurant shift operations desk where a manager and browser agent coordinate orders, stock, labor, and handoffs using the same revisioned state.",
      description:
        "I built 16 page-scoped WebMCP tools with deterministic previews, stale-write protection, and human approval before changes are adopted.",
      stack: ["TypeScript", "React", "WebMCP"],
      links: [
        {
          label: "cutoff-webmcp.vercel.app",
          href: "https://cutoff-webmcp.vercel.app/",
          prefix: "Live",
        },
        {
          label: "github.com/rutts29/cutoff-webmcp",
          href: "https://github.com/rutts29/cutoff-webmcp",
          prefix: "GitHub",
        },
      ],
    },
    {
      id: "codex2gpt",
      name: "codex2gpt",
      placement: "additional",
      summary:
        "Lets ChatGPT plan and review coding work while Codex carries it out inside approved workspaces.",
      description:
        "I built the delegation and safety boundaries around that handoff, including managed worktrees, explicit approvals, and audit records, without giving ChatGPT a general-purpose local shell.",
      stack: ["Rust", "MCP", "OAuth"],
      links: [
        {
          label: "github.com/rutts29/codex2gpt",
          href: "https://github.com/rutts29/codex2gpt",
          prefix: "GitHub",
        },
      ],
    },
    {
      id: "local-sec",
      name: "local-sec",
      placement: "additional",
      summary:
        "A local supply-chain guard that screens selected developer-tool installs before they run on the host.",
      description:
        "I built version-maturity checks, advisory and artifact analysis, staged review for supported installs, and explicit approval gates for higher-risk flows.",
      stack: ["Go", "Supply-chain security"],
      links: [
        {
          label: "github.com/rutts29/local-sec",
          href: "https://github.com/rutts29/local-sec",
          prefix: "GitHub",
        },
      ],
    },
    {
      id: "solprobe",
      name: "SolProbe",
      placement: "more",
      summary:
        "Detects and investigates training instability before a run wastes compute.",
      description:
        "I built the Apple Silicon telemetry path, repeatable fault simulations, alert workflows, and operations dashboard.",
      stack: ["Rust", "FastAPI", "Next.js"],
      links: [
        {
          label: "github.com/rutts29/solprobe",
          href: "https://github.com/rutts29/solprobe",
          prefix: "GitHub",
        },
      ],
    },
    {
      id: "smart-contract-thesis",
      name: "Smart-contract vulnerability detection",
      placement: "research",
      summary:
        "An undergraduate research project for finding and classifying smart-contract vulnerabilities from both source code and program structure.",
      description:
        "I fine-tuned CodeBERT on more than 47,000 smart contracts, explored graph models over abstract syntax trees and control-flow graphs, and built template-based fixes for reentrancy and arithmetic-overflow cases.",
      stack: ["Python", "PyTorch", "Transformers"],
    },
  ],

  skills: [
    {
      title: "Programming Languages",
      items: [
        { label: "Python", badgeSrc: "/badges/python.svg", badgeWidth: 67 },
        { label: "Rust", badgeSrc: "/badges/rust.svg", badgeWidth: 53 },
        { label: "TypeScript", badgeSrc: "/badges/typescript.svg", badgeWidth: 87 },
        { label: "Go", badgeSrc: "/badges/go.svg", badgeWidth: 53 },
      ],
    },
    {
      title: "AI & Agent Infrastructure",
      items: [
        { label: "Claude Code", badgeSrc: "/badges/claude-code.svg", badgeWidth: 97 },
        { label: "Codex", badgeSrc: "/badges/codex.svg", badgeWidth: 63 },
        { label: "OpenHands", badgeSrc: "/badges/openhands.svg", badgeWidth: 91 },
        { label: "Cursor", badgeSrc: "/badges/cursor.svg", badgeWidth: 65 },
        { label: "T3 Code", badgeSrc: "/badges/t3-code.svg", badgeWidth: 73 },
        { label: "MCP", badgeSrc: "/badges/mcp.svg", badgeWidth: 51 },
        { label: "vLLM", badgeSrc: "/badges/vllm.svg", badgeWidth: 57 },
      ],
    },
    {
      title: "Machine Learning",
      items: [
        { label: "PyTorch", badgeSrc: "/badges/pytorch.svg", badgeWidth: 71 },
        { label: "TensorFlow", badgeSrc: "/badges/tensorflow.svg", badgeWidth: 91 },
        { label: "Hugging Face", badgeSrc: "/badges/hugging-face.svg", badgeWidth: 99 },
        { label: "LoRA fine-tuning", badgeSrc: "/badges/lora.svg", badgeWidth: 121 },
        { label: "Pandas", badgeSrc: "/badges/pandas.svg", badgeWidth: 67 },
        { label: "NumPy", badgeSrc: "/badges/numpy.svg", badgeWidth: 67 },
      ],
    },
    {
      title: "Systems & Infrastructure",
      items: [
        { label: "FastAPI", badgeSrc: "/badges/fastapi.svg", badgeWidth: 69 },
        { label: "Next.js", badgeSrc: "/badges/next-js.svg", badgeWidth: 67 },
        { label: "Node.js", badgeSrc: "/badges/node-js.svg", badgeWidth: 69 },
        { label: "PostgreSQL", badgeSrc: "/badges/postgresql.svg", badgeWidth: 91 },
        { label: "SQLite", badgeSrc: "/badges/sqlite.svg", badgeWidth: 65 },
        { label: "Docker", badgeSrc: "/badges/docker.svg", badgeWidth: 67 },
        { label: "gVisor", badgeSrc: "/badges/gvisor.svg", badgeWidth: 63 },
        { label: "Git", badgeSrc: "/badges/git.svg", badgeWidth: 43 },
        { label: "Linux", badgeSrc: "/badges/linux.svg", badgeWidth: 57 },
        { label: "AWS", badgeSrc: "/badges/aws.svg", badgeWidth: 35 },
        { label: "Google Cloud", badgeSrc: "/badges/google-cloud.svg", badgeWidth: 51 },
        { label: "Cloudflare", badgeSrc: "/badges/cloudflare.svg", badgeWidth: 83 },
      ],
    },
  ],

  experience: [
    {
      company: { label: "CredShields", href: "https://credshields.com/" },
      role: "AI Engineer & ML Researcher",
      duration: "Apr 2025 – Sep 2026",
      details: [
        "Built the production foundation of CredShields One, an AI-assisted penetration-testing platform: sandboxed scan execution and the orchestrator/sub-agent architecture.",
        "Built whole-repository GitHub indexing and RAG for white-box scans.",
        "Owned SolidityScan's RAG and function-level AI pipeline end to end, extending LLM false-positive checks from 2–3 vulnerability categories to all of them, grounded in Solodit findings.",
        "Fine-tuned and published Solidity-CodeGen-v0.1 (Qwen3-4B), served with vLLM in an OpenZeppelin MCP workflow. Fine-tuned 8–12B models with LoRA for vulnerability-detection research.",
        "Built and shipped OpenHands-based agents for Slack debugging, issue creation and pull requests, plus a priority-aware CI agent with restricted production permissions.",
      ],
      relatedLinks: [
        {
          label: "one.credshields.com",
          href: "https://one.credshields.com/",
          prefix: "CredShields One",
        },
        {
          label: "solidityscan.com",
          href: "https://solidityscan.com/",
          prefix: "SolidityScan",
        },
      ],
    },
    {
      company: {
        label: "Sheridan College",
        href: "https://www.sheridancollege.ca/",
      },
      unit: {
        label: "Centre for Applied AI",
        href: "https://www.sheridancollege.ca/research/centres/applied-ai",
      },
      partner: { label: "TELUS", href: "https://www.telus.com/" },
      role: "Machine Learning Researcher",
      duration: "Jan 2025 – Apr 2025",
      details: [
        "Built generative models (VAE and DDPM) to synthesize RSSI fingerprints for indoor positioning research.",
        "Integrated synthetic data with regression localization pipelines (nearest neighbor, line-shifting baselines) on a 2D apartment setup.",
        "Co-authored IEEE MSWiM 2025 on synthetic RSSI augmentation and hybrid localization (Zx-WKNN).",
      ],
      relatedLinks: [
        {
          label: "DOI",
          href: "https://doi.org/10.1109/MSWiM67937.2025.11309178",
        },
      ],
    },
    {
      company: {
        label: "Sheridan College",
        href: "https://www.sheridancollege.ca/",
      },
      unit: {
        label: "Centre for Applied AI",
        href: "https://www.sheridancollege.ca/research/centres/applied-ai",
      },
      partner: {
        label: "McMaster University",
        href: "https://www.mcmaster.ca/",
      },
      role: "Full Stack Developer (Cross Platform)",
      duration: "Sep 2024 – Dec 2024",
      details: [
        "Ported a research web app to a cross-platform Flutter client (iOS and Android).",
        "Built REST APIs, Strapi CMS integration, and SQL schema with Git-based delivery.",
        "Implemented authentication and data-handling controls aligned with the project's sensitive-health-data requirements.",
      ],
    },
    {
      company: {
        label: "Sheridan College",
        href: "https://www.sheridancollege.ca/",
      },
      unit: {
        label: "Centre for Applied AI",
        href: "https://www.sheridancollege.ca/research/centres/applied-ai",
      },
      partner: {
        label: "Osteoporosis Canada",
        href: "https://osteoporosis.ca/",
      },
      role: "Machine Learning Researcher",
      duration: "May 2024 – Aug 2024",
      details: [
        "Built ML pipelines for imminent fracture-risk prediction: cleaning, feature extraction, training, and evaluation.",
        "Designed a soft-voting ensemble (Random Forest, XGBoost, and logistic regression).",
        "Evaluated with precision-recall, ROC-AUC, and calibration for false-negative-sensitive clinical use.",
      ],
    },
  ],

  writing: [
    {
      id: "ieee-mswim-2025",
      title:
        "Low-Error Indoor Positioning via Synthetic RSSI Augmentation and Zx–WKNN Hybrid Model",
      summary:
        "IEEE MSWiM 2025. Co-authored work on synthetic RSSI augmentation and hybrid indoor localization from the Sheridan and TELUS collaboration.",
      meta: "IEEE MSWiM 2025 · Conference paper",
      links: [
        {
          label: "10.1109/MSWiM67937.2025.11309178",
          href: "https://doi.org/10.1109/MSWiM67937.2025.11309178",
          prefix: "DOI",
        },
        {
          label: "DBLP record",
          href: "https://dblp.org/rec/conf/mswim/AhmedSCDZB25",
          prefix: "DBLP",
        },
      ],
    },
  ],

  story: {
    chapters: [
      {
        meta: "2022 – 2025 · Foundations",
        lead: "Computer science, with a machine learning specialization.",
        body: "I chose computer science to understand how software works, and picked the machine learning specialization early, before the current wave. AI was the obvious direction for a Tony Stark fan. I expected this future; I didn't expect it this soon.",
        roles: [
          {
            title: "Honours BSc, Computer Science (Data Analytics & ML)",
            org: { label: "Sheridan College", href: "https://www.sheridancollege.ca/" },
            dates: "2022 – 2025",
          },
        ],
      },
      {
        meta: "2024 – 2025 · Research",
        lead: "Research-trained, built for applied work.",
        body: "Two research terms at Sheridan's Centre for Applied AI: fracture-risk models with Osteoporosis Canada, then generative models for indoor positioning with TELUS, published at IEEE MSWiM 2025. The training stuck: before I build anything, I study the problem properly. Where I do my best work, though, is the applied side: a prototype running by the end of the week, tested against the real problem, and kept only if it holds. Research taught me to ask the right question. Shipping is where I answer it.",
        roles: [
          {
            title: "ML Researcher",
            org: {
              label: "Sheridan Centre for Applied AI",
              href: "https://www.sheridancollege.ca/research/centres/applied-ai",
            },
            partner: { label: "Osteoporosis Canada", href: "https://osteoporosis.ca/" },
            dates: "May – Aug 2024",
          },
          {
            title: "Full Stack Developer",
            org: {
              label: "Sheridan Centre for Applied AI",
              href: "https://www.sheridancollege.ca/research/centres/applied-ai",
            },
            partner: { label: "McMaster University", href: "https://www.mcmaster.ca/" },
            dates: "Sep – Dec 2024",
          },
          {
            title: "ML Researcher",
            org: {
              label: "Sheridan Centre for Applied AI",
              href: "https://www.sheridancollege.ca/research/centres/applied-ai",
            },
            partner: { label: "TELUS", href: "https://www.telus.com/" },
            dates: "Jan – Apr 2025",
            links: [
              {
                label: "IEEE MSWiM 2025",
                href: "https://doi.org/10.1109/MSWiM67937.2025.11309178",
              },
            ],
          },
        ],
      },
      {
        meta: "2025 – 2026 · Applied AI",
        lead: "Production AI for a security platform.",
        body: "At CredShields I built the production foundation of CredShields One, an AI-assisted penetration-testing platform: sandboxed scan execution and the orchestrator and sub-agent architecture. I also owned the AI pipeline behind SolidityScan, a smart-contract scanner, from RAG to function-level analysis.",
        highlights: [
          "Extended SolidityScan's LLM false-positive checks from 2–3 vulnerability categories to all categories, grounded in Solodit findings.",
          "Fine-tuned and published Solidity-CodeGen-v0.1, a Qwen3-4B model, and served it with vLLM in an OpenZeppelin MCP workflow.",
          "Shipped OpenHands-based agents for Slack debugging, issue creation and pull requests, plus a priority-aware CI agent with restricted production permissions.",
        ],
        roles: [
          {
            title: "AI Engineer & ML Researcher",
            org: { label: "CredShields", href: "https://credshields.com/" },
            dates: "Apr 2025 – Sep 2026",
            links: [
              { label: "CredShields One", href: "https://one.credshields.com/" },
              { label: "SolidityScan", href: "https://solidityscan.com/" },
            ],
          },
        ],
      },
      {
        meta: "Now · Agents",
        lead: "Keeping long agent sessions on course.",
        body: "Long-running agents can drift from what they were asked. I wanted a clear record of what agents actually do, and a way to keep them aligned with the goal without standing over them. That work includes agentlog, driftctl and Keeping Agents Honest.",
        roles: [],
      },
    ],
    thinking: [
      "LLMs learned from people, so in many ways they act like people. They forget things, make confident mistakes, behave the way they were taught, and need correcting.",
      "A modern model knows more than most experts, but its judgement is still early-career. So I design systems the way I'd teach my younger self: a clear goal, room to work, and someone checking the result.",
    ],
    next: [
      "Agents already write much of today's code, and the big labs are using AI to build better AI. What's still being worked out is the layer between a capable model and a dependable system: the harnesses, evaluations and controls that let agents be trusted with real work, in software first and then in every field that runs on it.",
      "That's the problem I want to keep working on, wherever it's being solved seriously.",
    ],
    contactInvite:
      "If you're putting AI to work on real problems, I'd like to hear about it.",
  },

  contact: {
    heading: "Let's talk.",
    intro:
      "Open to applied AI, agent infrastructure and forward-deployed roles.",
    links: [
      {
        label: "rutts291@gmail.com",
        href: "mailto:rutts291@gmail.com",
        icon: "email",
      },
      {
        label: "linkedin.com/in/ruttansh",
        href: "https://www.linkedin.com/in/ruttansh",
        icon: "linkedin",
      },
      {
        label: "github.com/rutts29",
        href: "https://github.com/rutts29",
        icon: "github",
      },
    ],
    emailCta: {
      label: "Email",
      mailto: "mailto:rutts291@gmail.com?subject=Hello%20%7C%200xrutts.com",
    },
  },
};
