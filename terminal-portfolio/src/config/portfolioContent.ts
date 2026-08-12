/**
 * Single source of truth for portfolio data.
 * Home and terminal both present this — do not duplicate facts elsewhere.
 */

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
  partnerUrl?: string;
  role: string;
  duration: string;
  location: string;
  details: string[];
  isCurrent?: boolean;
  /** Related publications or project links for this role. */
  relatedLinks?: PortfolioLink[];
};

export type Project = {
  id: string;
  name: string;
  featured: boolean;
  summary: string;
  description: string;
  stack: string[];
  image?: string;
  links?: PortfolioLink[];
};

export type WritingItem = {
  id: string;
  title: string;
  summary: string;
  meta?: string;
  /** When false or omitted for notes that are not ready yet. */
  published?: boolean;
  links?: PortfolioLink[];
};

export type ContactLink = {
  label: string;
  href?: string;
  icon: "email" | "linkedin" | "github" | "x" | "location";
};

export type PortfolioContent = {
  identity: {
    name: string;
    shortName: string;
    handle: string;
    title: string;
    location: string;
    locationDetail: string;
    hero: string;
    about: string[];
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
    links: ContactLink[];
    demoCta: {
      label: string;
      mailto: string;
    };
  };
};

export const portfolioContent: PortfolioContent = {
  identity: {
    name: "Ruttansh Bhatelia",
    shortName: "Rutts",
    handle: "0xRutts",
    title: "AI Systems Engineer · Applied ML Researcher",
    location: "Toronto, Canada",
    locationDetail: "Toronto, Ontario · Open to relocate",
    hero: "I build reliable AI systems and turn applied ML research into working tools.",
    about: [
      "I am an AI Systems Engineer and Applied ML Researcher. I build reliable AI systems and turn applied ML research into working tools.",
      "My strongest work is research plus local-first systems engineering — observability, evaluation, and bounded tooling for AI agents and training workflows.",
      "I hold an Honours BSc in Computer Science (Data Analytics) and stay engaged with applied research partners.",
    ],
    education: {
      degree:
        "Honours Bachelor of Science in Computer Science (Data Analytics)",
      detail:
        "Graduated 2025 · Toronto, Ontario · Applied AI, data engineering, and research collaboration.",
    },
  },

  proofFacts: [
    { label: "Based in", value: "Toronto" },
    { label: "Focus", value: "AI systems · applied ML" },
    { label: "Evidence", value: "Research + local systems" },
    { label: "Building at", value: "CredShields" },
  ],

  projects: [
    {
      id: "agentlog",
      name: "agentlog",
      featured: true,
      summary:
        "Local-first observability and evaluation for AI coding agents.",
      description:
        "Normalizes local harness artifacts into a provenance-aware SQLite ledger and revalidates source-backed transcript content before serving it. Six harness adapters; CLI, loopback dashboard, and read-only MCP tools with source identity checks.",
      stack: ["Python", "TypeScript", "SQLite", "MCP"],
    },
    {
      id: "solprobe",
      name: "SolProbe",
      featured: true,
      summary:
        "Local observability prototype for AI-training telemetry and anomaly workflows.",
      description:
        "A Rust sidecar, FastAPI service, and Next.js dashboard cover Apple Silicon collection and repeatable simulated faults.",
      stack: ["Rust", "FastAPI", "Next.js", "PyTorch"],
      image: "/projects/solprobe-landing.png",
    },
    {
      id: "codex2gpt",
      name: "codex2gpt",
      featured: true,
      summary: "A bounded local bridge from ChatGPT to Codex.",
      description:
        "Rust MCP server combining OAuth/PKCE, workspace allowlists, managed worktrees, audit records, and explicit approval boundaries without exposing a raw shell by default.",
      stack: ["Rust", "MCP", "OAuth"],
    },
    {
      id: "founder-intelligence",
      name: "Founder Intelligence",
      featured: false,
      summary:
        "Local-first founder-intelligence plugin with bounded tools and approvals.",
      description:
        "Nine bounded tools, explicit approval before paid X collection, SQLite persistence, and monthly credit controls.",
      stack: ["TypeScript", "SQLite"],
    },
    {
      id: "local-sec",
      name: "local-sec",
      featured: false,
      summary:
        "Local-first package-install guard for developer-tool installs.",
      description:
        "Mature-version selection, advisory checks, supported-flow artifact scanning, explicit approvals, and metadata inventory before selected installs.",
      stack: ["Go"],
    },
    {
      id: "keyed",
      name: "Keyed",
      featured: false,
      summary:
        "Privacy-aware Solana social prototype exploring wallet identity and creator monetization.",
      description:
        "Wallet identity, creator monetization, token-gated access, AI-assisted discovery, and tipping integrations.",
      stack: ["TypeScript", "Rust", "Python", "Solana", "PostgreSQL"],
      image: "/projects/keyed-landing.png",
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
        { label: "R", badgeSrc: "/badges/r.svg" },
      ],
    },
    {
      title: "AI, Data & ML Stack",
      items: [
        { label: "PyTorch", badgeSrc: "/badges/pytorch.svg" },
        { label: "TensorFlow", badgeSrc: "/badges/tensorflow.svg" },
        { label: "Hugging Face", badgeSrc: "/badges/hugging-face.svg" },
        { label: "Transformers", badgeSrc: "/badges/transformers.svg" },
        { label: "Unsloth", badgeSrc: "/badges/unsloth.svg" },
        { label: "vLLM", badgeSrc: "/badges/vllm.svg" },
        { label: "DeepSpeed", badgeSrc: "/badges/deepspeed.svg" },
        { label: "Pandas", badgeSrc: "/badges/pandas.svg" },
        { label: "NumPy", badgeSrc: "/badges/numpy.svg" },
        { label: "Tableau", badgeSrc: "/badges/tableau.svg" },
        { label: "Power BI", badgeSrc: "/badges/power-bi.svg" },
      ],
    },
    {
      title: "Full Stack",
      items: [
        { label: "HTML5", badgeSrc: "/badges/html5.svg" },
        { label: "CSS3", badgeSrc: "/badges/css3.svg" },
        { label: "React", badgeSrc: "/badges/react.svg" },
        { label: "Next.js", badgeSrc: "/badges/next-js.svg" },
        { label: "Node.js", badgeSrc: "/badges/node-js.svg" },
        { label: "Express", badgeSrc: "/badges/express.svg" },
        { label: "FastAPI", badgeSrc: "/badges/fastapi.svg" },
        { label: "Django", badgeSrc: "/badges/django.svg" },
        { label: "Flask", badgeSrc: "/badges/flask.svg" },
        { label: "PostgreSQL", badgeSrc: "/badges/postgresql.svg" },
        { label: "MongoDB", badgeSrc: "/badges/mongodb.svg" },
        { label: "MySQL", badgeSrc: "/badges/mysql.svg" },
        { label: "SQLite", badgeSrc: "/badges/sqlite.svg" },
        { label: "Milvus", badgeSrc: "/badges/milvus.svg" },
        { label: "Flutter", badgeSrc: "/badges/flutter.svg" },
      ],
    },
    {
      title: "Infra, DevOps & Tooling",
      items: [
        { label: "AWS", badgeSrc: "/badges/aws.svg" },
        { label: "Google Cloud", badgeSrc: "/badges/google-cloud.svg" },
        { label: "Azure", badgeSrc: "/badges/azure.svg" },
        { label: "Docker", badgeSrc: "/badges/docker.svg" },
        { label: "Git", badgeSrc: "/badges/git.svg" },
        { label: "Vercel", badgeSrc: "/badges/vercel.svg" },
        { label: "Netlify", badgeSrc: "/badges/netlify.svg" },
        { label: "Heroku", badgeSrc: "/badges/heroku.svg" },
        { label: "Firebase", badgeSrc: "/badges/firebase.svg" },
        { label: "Cloudflare", badgeSrc: "/badges/cloudflare.svg" },
        { label: "Linux", badgeSrc: "/badges/linux.svg" },
        { label: "Nginx", badgeSrc: "/badges/nginx.svg" },
        { label: "Postman", badgeSrc: "/badges/postman.svg" },
      ],
    },
  ],

  experience: [
    {
      company: "CredShields",
      companyUrl: "https://credshields.com/",
      role: "AI Engineer & ML Researcher",
      duration: "Apr 2025 – Present",
      location: "Part-time · Remote (Singapore)",
      isCurrent: true,
      details: [
        "Built backend and AI systems end to end for CredShields One: https://one.credshields.com/.",
        "Built AI components for SolidityScan, CredShields' smart contract vulnerability scanner: https://solidityscan.com/.",
        "Led LLM-assisted pipelines, RAG workflows, and finetuned models for smart contract vulnerability analysis.",
      ],
    },
    {
      company: "TELUS",
      companyUrl: "https://www.telus.com/en",
      role: "Machine Learning Researcher",
      duration: "Jan 2025 – Apr 2025",
      location: "Part-time · Oakville, Ontario",
      details: [
        "Architected a generative-AI indoor localization system with research partners.",
        "Synthesized RSSI data with VAEs to auto-generate virtual fingerprints.",
        "Co-authored an IEEE MSWiM 2025 paper on synthetic RSSI augmentation and a hybrid Zx–WKNN model for indoor positioning.",
      ],
      relatedLinks: [
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
      company: "McMaster University",
      companyUrl: "https://www.mcmaster.ca/",
      role: "Full Stack Developer",
      duration: "Sep 2024 – Dec 2024",
      location: "Part-time · Oakville, Ontario",
      details: [
        "Ported a web experience into a Flutter-powered iOS/Android build.",
        "Enhanced UX, enforced GDPR/HIPAA compliance, and integrated Strapi + SQL.",
        "Iterated via Figma, REST APIs, and Git-based review cycles.",
      ],
    },
    {
      company: "Osteoporosis Canada",
      companyUrl: "https://osteoporosis.ca/",
      partnerUrl: "https://naryant.com/",
      role: "Machine Learning Researcher",
      duration: "May 2024 – Aug 2024",
      location: "Co-op · Oakville, Ontario",
      details: [
        "Collaborated on ML research and imminent fracture risk prediction.",
        "Engineered features, trained ensembles, and raised accuracy 30–40%.",
        "Documented outcomes for stakeholders and knowledge sharing.",
      ],
    },
    {
      company: "Freelance",
      role: "Full Stack Developer",
      duration: "Dec 2023 – May 2024",
      location: "Part-time · Remote",
      details: [
        "Delivered full-stack web applications for diverse clients.",
        "Built responsive frontends and scalable backends using modern frameworks.",
        "Managed end-to-end development lifecycle from design to deployment.",
      ],
    },
  ],

  writing: [
    {
      id: "ieee-mswim-2025",
      title:
        "Low-Error Indoor Positioning via Synthetic RSSI Augmentation and Zx–WKNN Hybrid Model",
      summary:
        "Co-authored an IEEE MSWiM 2025 paper on synthetic RSSI augmentation and a hybrid Zx–WKNN model for indoor positioning.",
      meta: "IEEE MSWiM 2025 · Conference paper",
      published: true,
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
      title: "Engineering notes",
      summary: "Short writing on AI systems and applied ML.",
      meta: "Coming soon",
      published: false,
    },
  ],

  contact: {
    heading: "Let's talk.",
    intro: "Open to roles and collaborations in applied AI and ML systems.",
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
      {
        label: "Toronto, Ontario · Open to relocate",
        icon: "location",
      },
    ],
    demoCta: {
      label: "Request technical demo",
      mailto:
        "mailto:rutts291@gmail.com?subject=Request%20technical%20demo%20%E2%80%94%200xRutts",
    },
  },
};
