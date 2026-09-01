export type PortfolioLink = {
  label: string;
  href: string;
  prefix?: string;
};

export type SkillItem = {
  label: string;
  badgeSrc?: string;
  badgeWidth?: number;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export type ExperienceRole = {
  company: PortfolioLink;
  unit?: PortfolioLink;
  partner?: PortfolioLink;
  collaboratorNote?: string;
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
  links?: PortfolioLink[];
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
    workAuthorization: string;
    metaDescription: string;
    hero: string;
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
    emailCta: {
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
    title: "Applied AI Engineer",
    location: "Toronto, Ontario",
    workAuthorization: "Authorized to work in Canada",
    metaDescription:
      "Applied AI Engineer in Toronto. I build the systems around models: agent harnesses, orchestration, and evaluation-minded controls so AI work is reliable and reviewable.",
    hero:
      "I build the systems around models: agent harnesses, orchestration, and evaluation-minded controls that make AI work reliable and reviewable, not just impressive demos.",
    about: [
      "My work spans secure agentic systems, developer and security tooling, and applied machine learning.",
      "I work Python-first and use TypeScript to ship inside existing products and services.",
    ],
    specialties: [
      "Applied AI",
      "Agentic systems",
      "Systems design",
      "Python",
      "TypeScript",
      "Machine learning",
      "LLM applications",
      "Harness engineering",
      "AI security tooling",
    ],
    education: {
      degree: "Honours Bachelor of Science in Computer Science",
      detail:
        "Specialization in Data Analytics & Machine Learning · Jan 2022 – Dec 2025 · Oakville, Ontario",
    },
  },

  proofFacts: [
    { label: "Education", value: "Honours BSc in Computer Science" },
    { label: "Current role", value: "AI Engineer, CredShields" },
    { label: "Published at", value: "IEEE MSWiM 2025" },
    { label: "Focus", value: "Agentic systems · evals" },
  ],

  projects: [
    {
      id: "agentlog",
      name: "agentlog",
      featured: true,
      summary:
        "Local-first observability and evaluation across multiple AI coding harnesses.",
      description:
        "Built read-only adapters and a provenance-aware SQLite ledger that reconcile sessions and revalidate transcript content from canonical local sources, then serve it through a CLI, local dashboard, and read-only MCP tools.",
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
      id: "driftctl",
      name: "driftctl",
      featured: true,
      summary: "Opt-in continuity layer for long Codex sessions.",
      description:
        "Hackathon MVP with source-linked intent, deterministic validation, and resume and compaction recovery so accepted goals and steering survive long sessions. Evals are published in-repo, including negative results. It is not a security sandbox and currently supports Codex only.",
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
      id: "codex2gpt",
      name: "codex2gpt",
      featured: true,
      summary:
        "Local prototype for bounded delegation between ChatGPT and Codex.",
      description:
        "Uses workspace-scoped context, managed worktrees, OAuth/PKCE, audit records, and explicit approval boundaries without exposing a raw shell by default.",
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
      featured: true,
      summary: "Local-first guard for selected developer-tool installs.",
      description:
        "Applies mature-version selection, advisory checks, supported artifact scanning, explicit approvals, and metadata inventory.",
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
      featured: false,
      summary:
        "Observability prototype for AI-training telemetry, anomaly detection, and recovery suggestions.",
      description:
        "Combines a Rust sidecar, FastAPI service, and Next.js dashboard. Apple Silicon collection and simulated paths are verified; cloud, NVIDIA, and live-LLM paths remain prototype or unverified.",
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
      featured: false,
      summary:
        "Undergraduate thesis on CodeBERT and graph-based smart-contract vulnerability analysis.",
      description:
        "Fine-tuned CodeBERT, explored AST and CFG graph models, and developed template-based fixes for selected vulnerability classes. Dataset metrics remain in the thesis rather than serving as a homepage trophy.",
      stack: ["Python", "PyTorch", "Transformers"],
    },
    {
      id: "loanref",
      name: "LoanRef",
      featured: false,
      summary:
        "Multi-tenant commercial loan referral SaaS for brokers, partners, and borrowers.",
      description:
        "Shipped a role-isolated Partner, Borrower, and Admin product with a Kanban pipeline and server-enforced stage transitions. Security controls include CSRF checks, rate limiting, hashed tokens, anti-enumeration, and data-layer scoping. It is product and security engineering, not an AI runtime.",
      stack: ["TypeScript", "Next.js", "PostgreSQL", "Security"],
      links: [
        {
          label: "loan-ref.vercel.app",
          href: "https://loan-ref.vercel.app/",
          prefix: "Live",
        },
      ],
    },
  ],

  skills: [
    {
      title: "Programming Languages",
      items: [
        { label: "Python", badgeSrc: "/badges/python.svg", badgeWidth: 67 },
        { label: "TypeScript", badgeSrc: "/badges/typescript.svg", badgeWidth: 87 },
        { label: "Rust", badgeSrc: "/badges/rust.svg", badgeWidth: 53 },
        { label: "Go", badgeSrc: "/badges/go.svg", badgeWidth: 53 },
      ],
    },
    {
      title: "AI & ML",
      items: [
        { label: "PyTorch", badgeSrc: "/badges/pytorch.svg", badgeWidth: 71 },
        { label: "TensorFlow", badgeSrc: "/badges/tensorflow.svg", badgeWidth: 91 },
        { label: "Hugging Face", badgeSrc: "/badges/hugging-face.svg", badgeWidth: 99 },
        { label: "Transformers", badgeSrc: "/badges/transformers.svg", badgeWidth: 101 },
        { label: "Pandas", badgeSrc: "/badges/pandas.svg", badgeWidth: 67 },
        { label: "NumPy", badgeSrc: "/badges/numpy.svg", badgeWidth: 67 },
      ],
    },
    {
      title: "Web & Data Systems",
      items: [
        { label: "FastAPI", badgeSrc: "/badges/fastapi.svg", badgeWidth: 69 },
        { label: "Next.js", badgeSrc: "/badges/next-js.svg", badgeWidth: 67 },
        { label: "Node.js", badgeSrc: "/badges/node-js.svg", badgeWidth: 69 },
        { label: "PostgreSQL", badgeSrc: "/badges/postgresql.svg", badgeWidth: 91 },
        { label: "SQLite", badgeSrc: "/badges/sqlite.svg", badgeWidth: 65 },
      ],
    },
    {
      title: "Infrastructure & Tooling",
      items: [
        { label: "Docker", badgeSrc: "/badges/docker.svg", badgeWidth: 67 },
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
      role: "AI Engineer",
      duration: "Apr 2025 – Present",
      location: "Contract · Part-time · Remote",
      isCurrent: true,
      details: [
        "Own Applied AI systems for CredShields One: agentic workflows, orchestration, and review-friendly outputs for AI-assisted pentesting across web, cloud, API, and mobile.",
        "Contribute AI components on SolidityScan for smart-contract analysis with grounded, reviewable findings.",
        "Keep clear ownership boundaries between AI modules and the rest of the platform so agent work can be tested and shipped cleanly.",
        "Improve reliability of LLM-assisted findings with grounding, validation, and human-review paths (fewer opaque one-shot answers).",
        "Fine-tune and evaluate models and prompting setups for vulnerability-related tasks using precision/recall-style metrics, not accuracy alone.",
        "Ship supporting ML tooling for feature extraction, anomaly signals, and suggested remediations alongside existing scanners.",
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
      location: "Contract · Part-time · Oakville, Ontario",
      details: [
        "Built generative models (VAE and DDPM) to synthesize RSSI fingerprints for indoor positioning research.",
        "Integrated synthetic data with regression localization pipelines (nearest neighbor, line-shifting baselines) on a 2D apartment setup.",
        "Co-authored IEEE MSWiM 2025 on synthetic RSSI augmentation and hybrid localization (Zx-WKNN).",
      ],
      relatedLinks: [
        {
          label: "Publication: DOI",
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
      location: "Contract · Part-time · Oakville, Ontario",
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
      collaboratorNote: "Project also involved Naryant",
      role: "Machine Learning Researcher",
      duration: "May 2024 – Aug 2024",
      location: "Co-op · Oakville, Ontario",
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
    {
      id: "notes-soon",
      title: "Technical articles",
      summary: "Concise notes on applied AI systems, evaluation, and security.",
      meta: "Articles coming soon",
    },
  ],

  contact: {
    heading: "Let's talk.",
    intro:
      "Open to Applied AI engineering, LLM and agent systems, and AI deployment roles in Canada.",
    location: "Toronto, Ontario · Authorized to work in Canada",
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
      {
        label: "x.com/0xRutts",
        href: "https://x.com/0xRutts",
        icon: "x",
      },
    ],
    emailCta: {
      label: "Email",
      mailto: "mailto:rutts291@gmail.com?subject=Hello%20%7C%200xrutts.com",
    },
  },
};
