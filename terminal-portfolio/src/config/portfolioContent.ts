export type PortfolioLink = {
  label: string;
  href: string;
  prefix?: string;
};

export type SkillItem = {
  label: string;
  badgeSrc?: string;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export type ExperienceRole = {
  company: string;
  companyUrl?: string;
  role: string;
  duration: string;
  location: string;
  details: string[];
  isCurrent?: boolean;
  relatedLinks?: PortfolioLink[];
};

export type Project = {
  id: string;
  name: string;
  featured: boolean;
  summary: string;
  description: string;
  stack: string[];
};

export type WritingItem = {
  id: string;
  title: string;
  summary: string;
  meta?: string;
  links?: PortfolioLink[];
};

export type ContactLink = {
  label: string;
  href: string;
  icon: "email" | "linkedin" | "github" | "x";
};

export type PortfolioContent = {
  siteUrl: string;
  identity: {
    name: string;
    shortName: string;
    handle: string;
    title: string;
    location: string;
    hero: string;
    summary: string;
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
  contact: {
    heading: string;
    intro: string;
    location: string;
    links: ContactLink[];
    demoCta: {
      label: string;
      mailto: string;
    };
  };
};

export const portfolioContent: PortfolioContent = {
  siteUrl: "https://www.0xrutts.com",
  identity: {
    name: "Ruttansh Bhatelia",
    shortName: "Rutts",
    handle: "0xRutts",
    title: "AI Systems Engineer · Applied ML Researcher",
    location: "Toronto, Ontario",
    hero:
      "I design the systems around AI models: agent harnesses, specialized workflows, and evaluation infrastructure built for security, observability, and human control.",
    summary:
      "Across coding agents, smart-contract security, and applied ML research, I use cross-model and cross-harness evidence to separate model behavior from context, tools, orchestration, and product failures.",
    about: [
      "My strongest work combines AI system design with security and product judgment across context, tools, permissions, provenance, state, and human control.",
      "I turn that architecture into specialized systems for smart-contract security, AI-assisted development, and applied ML research.",
    ],
    specialties: [
      "AI systems and agent harness design",
      "Agentic workflow engineering",
      "AI agent observability and evaluation",
      "Cross-model and cross-harness evaluation",
      "Model-decoupled workflow infrastructure",
      "Context engineering and tool integration",
      "Security, privacy, and human-in-the-loop controls",
      "Applied machine learning research",
      "Smart-contract security systems",
    ],
    education: {
      degree:
        "Honours Bachelor of Science in Computer Science (Data Analytics)",
      detail: "Jan 2022 – Dec 2025 · Oakville, Ontario",
    },
  },

  proofFacts: [
    { label: "Education", value: "Honours BSc · Data Analytics" },
    { label: "Current role", value: "CredShields" },
    { label: "Published at", value: "IEEE MSWiM 2025" },
    { label: "Focus", value: "AI systems · evaluation" },
  ],

  projects: [
    {
      id: "agentlog",
      name: "agentlog",
      featured: true,
      summary:
        "Local-first observability and evaluation across six AI coding harnesses.",
      description:
        "Built read-only adapters and a provenance-aware SQLite ledger that reconcile duplicate sessions and revalidate transcript content from canonical local sources before serving it through a CLI, local dashboard, and read-only MCP tools.",
      stack: ["Python", "TypeScript", "SQLite", "MCP"],
    },
    {
      id: "solprobe",
      name: "SolProbe",
      featured: true,
      summary:
        "A local observability prototype for AI-training systems.",
      description:
        "Built a Rust telemetry sidecar, FastAPI control plane for anomaly detection and policy evaluation, and Next.js operations console. The verified local scope covers Apple Silicon telemetry and repeatable simulated faults.",
      stack: ["Rust", "FastAPI", "Next.js", "PyTorch"],
    },
    {
      id: "codex2gpt",
      name: "codex2gpt",
      featured: true,
      summary: "A local Rust prototype for bounded delegation between ChatGPT and Codex.",
      description:
        "Built a Rust MCP server with workspace-scoped context, managed worktrees, OAuth/PKCE, audit records, and approval boundaries that prevent model-controlled authorization without exposing a raw shell by default.",
      stack: ["Rust", "MCP", "OAuth"],
    },
    {
      id: "smart-contract-thesis",
      name: "Smart Contract Vulnerability Detection",
      featured: true,
      summary:
        "Undergraduate thesis on CodeBERT and graph-based smart-contract analysis.",
      description:
        "Fine-tuned CodeBERT on 47,000+ smart contracts, reaching 99.89% binary accuracy and 89.31% multi-class accuracy on the thesis dataset. Also explored AST- and CFG-based graph models and template-based fixes for reentrancy and arithmetic overflow.",
      stack: ["Python", "PyTorch", "Transformers", "Solidity"],
    },
    {
      id: "founder-intelligence",
      name: "Founder Intelligence",
      featured: false,
      summary:
        "A host- and model-decoupled workflow for structured founder intelligence.",
      description:
        "Built nine bounded MCP tools that turn untrusted X evidence into reviewable decisions, with approval before paid collection, SQLite persistence, and atomic monthly credit controls.",
      stack: ["TypeScript", "SQLite", "MCP"],
    },
    {
      id: "local-sec",
      name: "local-sec",
      featured: false,
      summary:
        "A local-first guard for selected developer-tool installs.",
      description:
        "Built a zero-dependency Go guard that selects mature versions, checks advisories, stages and scans supported artifacts, and fails closed when package identity or policy cannot be proven.",
      stack: ["Go"],
    },
    {
      id: "keyed",
      name: "Keyed",
      featured: false,
      summary:
        "A multi-service Solana social prototype with AI-assisted discovery.",
      description:
        "Architected and implemented a prototype spanning Next.js, Express and BullMQ, FastAPI retrieval and moderation pipelines, and Anchor programs for social and payment workflows.",
      stack: ["TypeScript", "FastAPI", "Rust", "Solana", "Docker"],
    },
  ],

  skills: [
    {
      title: "Programming Languages",
      items: [
        { label: "Python", badgeSrc: "/badges/python.svg" },
        { label: "JavaScript", badgeSrc: "/badges/javascript.svg" },
        { label: "TypeScript", badgeSrc: "/badges/typescript.svg" },
        { label: "Rust", badgeSrc: "/badges/rust.svg" },
        { label: "C#", badgeSrc: "/badges/csharp.svg" },
        { label: "Solidity", badgeSrc: "/badges/solidity.svg" },
      ],
    },
    {
      title: "AI & ML",
      items: [
        { label: "PyTorch", badgeSrc: "/badges/pytorch.svg" },
        { label: "TensorFlow", badgeSrc: "/badges/tensorflow.svg" },
        { label: "Hugging Face", badgeSrc: "/badges/hugging-face.svg" },
        { label: "Transformers", badgeSrc: "/badges/transformers.svg" },
        { label: "Pandas", badgeSrc: "/badges/pandas.svg" },
        { label: "NumPy", badgeSrc: "/badges/numpy.svg" },
      ],
    },
    {
      title: "Web & Data Systems",
      items: [
        { label: "FastAPI", badgeSrc: "/badges/fastapi.svg" },
        { label: "Next.js", badgeSrc: "/badges/next-js.svg" },
        { label: "React", badgeSrc: "/badges/react.svg" },
        { label: "Node.js", badgeSrc: "/badges/node-js.svg" },
        { label: "PostgreSQL", badgeSrc: "/badges/postgresql.svg" },
        { label: "SQLite", badgeSrc: "/badges/sqlite.svg" },
      ],
    },
    {
      title: "Infrastructure & Tooling",
      items: [
        { label: "Docker", badgeSrc: "/badges/docker.svg" },
        { label: "Git", badgeSrc: "/badges/git.svg" },
        { label: "Linux", badgeSrc: "/badges/linux.svg" },
        { label: "AWS", badgeSrc: "/badges/aws.svg" },
        { label: "Google Cloud", badgeSrc: "/badges/google-cloud.svg" },
        { label: "Cloudflare", badgeSrc: "/badges/cloudflare.svg" },
      ],
    },
  ],

  experience: [
    {
      company: "CredShields",
      companyUrl: "https://credshields.com/",
      role: "AI Engineer & ML Researcher",
      duration: "Apr 2025 – Present",
      location: "Contract · Part-time · Remote",
      isCurrent: true,
      details: [
        "Lead the design and implementation of a backend AI system and agent harness for smart-contract security.",
        "Develop domain-specific workflows, retrieval, and knowledge systems for LLM-assisted vulnerability analysis with explicit review boundaries.",
        "Fine-tune and evaluate language models with PyTorch and Hugging Face, achieving 90%+ precision on the project's vulnerability-classification evaluation.",
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
      company: "TELUS & Sheridan Centre for Applied AI",
      role: "Machine Learning Researcher",
      duration: "Jan 2025 – Apr 2025",
      location: "Contract · Part-time · Oakville, Ontario",
      details: [
        "Developed VAE and DDPM approaches for synthetic RSSI fingerprint generation in an industry-academic indoor-positioning project.",
        "Integrated synthetic augmentation with regression pipelines for 2D apartment localization.",
        "Evaluated synthetic-data quality and localization error across changing indoor conditions.",
      ],
    },
    {
      company: "McMaster University & Sheridan Centre for Applied AI",
      role: "Full Stack Developer",
      duration: "Sep 2024 – Dec 2024",
      location: "Contract · Part-time · Oakville, Ontario",
      details: [
        "Translated a web product into a Flutter app for iOS and Android.",
        "Developed features for GDPR- and HIPAA-aligned handling of sensitive health data.",
        "Built REST APIs, integrated Strapi CMS, and designed the SQL database schema.",
      ],
    },
    {
      company: "Osteoporosis Canada & Sheridan Centre for Applied AI",
      role: "Machine Learning Researcher",
      duration: "May 2024 – Aug 2024",
      location: "Co-op · Oakville, Ontario",
      details: [
        "Built machine-learning pipelines for imminent-fracture-risk prediction.",
        "Combined Random Forest, XGBoost, and Logistic Regression in a soft-voting ensemble.",
        "Evaluated precision-recall, ROC-AUC, and calibration trade-offs for false-negative-sensitive healthcare research.",
      ],
    },
  ],

  writing: [
    {
      id: "ieee-mswim-2025",
      title:
        "Low-Error Indoor Positioning via Synthetic RSSI Augmentation and Zx–WKNN Hybrid Model",
      summary:
        "Co-authored research using autoencoders and VAEs for synthetic RSSI augmentation, reporting 6–25% lower RMSE and 11–400% higher R² in the paper's evaluation.",
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
    {
      id: "notes-soon",
      title: "Technical articles",
      summary:
        "Concise notes on building, evaluating, and securing AI systems.",
      meta: "Articles coming soon",
    },
  ],

  contact: {
    heading: "Let's talk.",
    intro:
      "Open to AI engineering, agent infrastructure, and applied ML research roles, plus selected collaborations.",
    location: "Toronto, Ontario; open to relocation",
    links: [
      {
        label: "rutts291@gmail.com",
        href: "mailto:rutts291@gmail.com",
        icon: "email",
      },
      {
        label: "linkedin.com/in/ruttansh-bhatelia",
        href: "https://www.linkedin.com/in/ruttansh-bhatelia",
        icon: "linkedin",
      },
      {
        label: "github.com/rutts29",
        href: "https://github.com/rutts29",
        icon: "github",
      },
      {
        label: "x.com/0xRutts",
        href: "https://x.com/0xRutts",
        icon: "x",
      },
    ],
    demoCta: {
      label: "Request technical demo",
      mailto:
        "mailto:rutts291@gmail.com?subject=Request%20technical%20demo%20%7C%200xRutts",
    },
  },
};
