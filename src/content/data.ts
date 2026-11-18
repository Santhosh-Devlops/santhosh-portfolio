// Single factual source for the site. Facts come from the resume PDF and the
// public GitHub repositories (inspected 2026-11-18). See docs/PROJECT_SELECTION.md.

import type { GlyphName } from "@/components/ui/Glyph";

export const profile = {
  name: "SANTHOSH KUMAR K",
  roles: ["AI Enthusiast", "Software Developer", "Full Stack Developer", "Independent Builder"],
  email: "santhoshkumark7680@gmail.com",
  location: "Madurai, Tamil Nadu, India",
  resumePdf: "/resume/Santhosh_Kumar_K_Resume.pdf",
  resumePreview: "/resume/resume-preview.png",
  photo: "/images/santhosh-kumar-k.webp",
  languages: ["English", "Tamil"],
};

export const socials: { label: string; handle: string; href: string; glyph: GlyphName }[] = [
  { label: "GitHub", handle: "Santhosh-Devlops", href: "https://github.com/Santhosh-Devlops", glyph: "github" },
  { label: "LinkedIn", handle: "santhosh-kumar-k", href: "https://www.linkedin.com/in/santhosh-kumar-k-60237a384", glyph: "linkedin" },
  { label: "LeetCode", handle: "SanthoshK_2k6", href: "https://leetcode.com/u/SanthoshK_2k6", glyph: "leetcode" },
  { label: "HackerRank", handle: "krishya2005_bit1", href: "https://www.hackerrank.com/profile/krishya2005_bit1", glyph: "hackerrank" },
];

export const about = [
  "I'm Santhosh Kumar K, an Information Technology student driven by curiosity about Artificial Intelligence, software engineering and emerging technologies.",
  "I enjoy exploring how intelligent systems work, experimenting with new approaches and transforming technical concepts into practical applications.",
  "From full-stack development to AI-powered solutions, I approach every project as an opportunity to learn, experiment and create something meaningful.",
  "I believe technology becomes powerful when ideas are translated into real-world solutions.",
];

export type ProjectId = "multidoc-rag" | "oracle" | "recruitai" | "dymeter";

export type Skill = {
  id: string;
  name: string;
  glyph: GlyphName;
  description: string;
  evidence: string;
  related: string[];
  projects: ProjectId[];
};

export type SkillCategory = { id: string; label: string; index: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    index: "01",
    skills: [
      { id: "java", name: "Java", glyph: "java", description: "Object-oriented language used for desktop tools and a from-scratch neural anomaly detector.", evidence: "Resume · OAD- (DyMETER Java port) · Memory_Management_Techniques · LeetCode solutions repo", related: ["OOP", "Swing", "Data Structures"], projects: ["dymeter"] },
      { id: "python", name: "Python", glyph: "python", description: "Primary language for the AI back ends: parsing, embeddings, statistics and API servers.", evidence: "Resume · Multi-Modal-RAG-1 · BI-Forecast-AI · Resume-Screener-AI", related: ["FastAPI", "Pandas", "scikit-learn"], projects: ["multidoc-rag", "oracle", "recruitai"] },
      { id: "c", name: "C", glyph: "c", description: "Systems-level fundamentals: memory, pointers and procedural design.", evidence: "Resume — technical skills", related: ["Operating Systems", "Data Structures"], projects: [] },
      { id: "cpp", name: "C++", glyph: "cpp", description: "Used for algorithmic problem solving and core computer-science practice.", evidence: "Resume — technical skills", related: ["Data Structures", "OOP"], projects: [] },
    ],
  },
  {
    id: "web",
    label: "Web",
    index: "02",
    skills: [
      { id: "html", name: "HTML", glyph: "html", description: "Semantic page structure for full-stack and marketing sites.", evidence: "Resume · Ripples-Solutions · My_Portfolio", related: ["CSS", "Accessibility"], projects: [] },
      { id: "css", name: "CSS", glyph: "css", description: "Layout, theming and Tailwind-based design systems with light and dark modes.", evidence: "Resume · Tailwind configs in BI-Forecast-AI and Multi-Modal-RAG-1", related: ["Tailwind CSS", "Responsive design"], projects: ["oracle", "multidoc-rag"] },
      { id: "javascript", name: "JavaScript", glyph: "javascript", description: "Language of every project front end in this portfolio.", evidence: "Resume · all four selected repositories", related: ["React", "Axios"], projects: ["multidoc-rag", "oracle", "recruitai"] },
      { id: "react", name: "React.js", glyph: "react", description: "Routed single-page dashboards with charts, modals and protected routes, built on Vite.", evidence: "Resume · React + Vite front ends in three selected repos", related: ["Vite", "React Router", "Recharts"], projects: ["multidoc-rag", "oracle", "recruitai"] },
      { id: "node", name: "Node.js", glyph: "node", description: "JavaScript runtime for servers and tooling.", evidence: "Resume · small (server.js) repo", related: ["Express", "REST APIs"], projects: [] },
      { id: "graphql", name: "GraphQL", glyph: "graphql", description: "Typed query language for APIs.", evidence: "Resume — technical skills", related: ["APIs", "Schemas"], projects: [] },
    ],
  },
  {
    id: "data",
    label: "Database",
    index: "03",
    skills: [
      { id: "mysql", name: "MySQL", glyph: "database", description: "Relational modelling and SQL for application data.", evidence: "Resume — technical skills", related: ["SQL", "SQLite", "DuckDB"], projects: ["oracle", "recruitai"] },
      { id: "mongodb", name: "MongoDB", glyph: "document-db", description: "Document database for flexible JSON-shaped data.", evidence: "Resume — technical skills", related: ["NoSQL", "Node.js"], projects: [] },
    ],
  },
  {
    id: "core",
    label: "Core CS",
    index: "04",
    skills: [
      { id: "dsa", name: "Data Structures & Algorithms", glyph: "graph", description: "Problem-solving practice tracked publicly on LeetCode and HackerRank.", evidence: "Resume · Leet-Problems-Santhosh repo · LeetCode profile", related: ["Java", "Complexity analysis"], projects: [] },
      { id: "oop", name: "Object-Oriented Programming", glyph: "cubes", description: "Class design and modular structure — e.g. the DyMETER engine split into AutoEncoder, Controller and Optimizer classes.", evidence: "Resume · OAD- source layout", related: ["Java", "Design patterns"], projects: ["dymeter"] },
      { id: "os", name: "Operating Systems", glyph: "layers", description: "Memory-allocation algorithms implemented as an interactive app: first, best, worst fit, buddy and slab.", evidence: "Resume · Memory_Management_Techniques repo", related: ["Java", "Memory management"], projects: [] },
      { id: "crypto", name: "Cryptography", glyph: "key", description: "Foundations of encryption, hashing and secure design; applied in password hashing and safe-SQL validation.", evidence: "Resume — technical skills · Deloitte Cyber Job Simulation", related: ["Security", "Hashing"], projects: ["multidoc-rag", "oracle"] },
    ],
  },
  {
    id: "ai",
    label: "AI & Emerging",
    index: "05",
    skills: [
      { id: "rag", name: "Retrieval-Augmented Generation", glyph: "neural", description: "Chunking, dense embeddings and grounded answering with cited sources.", evidence: "Multi-Modal-RAG-1 repository", related: ["sentence-transformers", "Vector search", "Qwen2.5"], projects: ["multidoc-rag"] },
      { id: "agents", name: "Multi-Agent Systems", glyph: "agents", description: "Supervisor and specialist agents with stored runs, retries and audit trails.", evidence: "BI-Forecast-AI · Multi-Modal-RAG-1 · OpenAI Agents and Workflows certification", related: ["Orchestration", "Tool use"], projects: ["oracle", "multidoc-rag"] },
      { id: "nlp", name: "Semantic Matching & NLP", glyph: "vector", description: "Sentence-embedding similarity with a TF-IDF fallback and explainable thresholds.", evidence: "Resume-Screener-AI repository", related: ["sentence-transformers", "scikit-learn"], projects: ["recruitai", "multidoc-rag"] },
      { id: "llm", name: "LLM Integration", glyph: "spark", description: "Gemini, Qwen and Hugging Face routers behind back-end-only keys, with controlled failure states.", evidence: "Three selected repos · Generative AI (LinkedIn) · Applied AI Foundations (OpenAI)", related: ["Prompt design", "Hugging Face"], projects: ["multidoc-rag", "oracle", "recruitai"] },
      { id: "ml", name: "Machine Learning", glyph: "wave", description: "Autoencoders, evidential learning and adaptive thresholds for streaming anomaly detection.", evidence: "OAD- · Dymeter-MANN-OAD repositories", related: ["Anomaly detection", "Concept drift"], projects: ["dymeter"] },
      { id: "analytics", name: "Data Analytics & Forecasting", glyph: "bars", description: "Profiling, statistics, anomaly checks and time-series forecasting in Python.", evidence: "BI-Forecast-AI · Data Analytics with Python (IIT Kharagpur) · Tata GenAI Data Analytics internship", related: ["Pandas", "statsmodels", "DuckDB"], projects: ["oracle"] },
      { id: "vision", name: "Computer Vision", glyph: "eye", description: "Image captioning with BLIP inside the document pipeline; CNN cloud-image work listed on the resume.", evidence: "Multi-Modal-RAG-1 · Resume (rainfall prediction project)", related: ["BLIP", "CNN"], projects: ["multidoc-rag"] },
      { id: "cloud", name: "Cloud AI (AWS)", glyph: "cloud", description: "Foundational AWS AI and ML services, responsible AI and model selection.", evidence: "AWS Certified AI Practitioner (Feb 2026)", related: ["AWS", "Responsible AI"], projects: [] },
    ],
  },
];

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  codename: string;
  category: string;
  tagline: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  architecture: string[];
  contribution: string;
  repo: string;
  relatedRepos?: { label: string; href: string }[];
  demo: string | null;
  updated: string;
  visual:
    | { kind: "schematic"; caption: string }
    | { kind: "image"; src: string; alt: string; caption: string };
};

export const projects: Project[] = [
  {
    id: "multidoc-rag",
    index: "01",
    title: "MultiDoc RAG",
    codename: "Multimodal Document Assistant",
    category: "Generative AI · RAG",
    tagline: "Reads text, images, tables and equations — then answers with evidence.",
    problem: "Technical documents mix prose with figures, tables and equations. A plain chatbot either ignores those parts or answers without showing where an answer came from.",
    solution: "A document assistant that runs a dedicated extractor per content type, embeds everything locally and answers questions with Qwen2.5-7B grounded in retrieved evidence, using open-source models only.",
    features: [
      "Six extractors: text and layout, images, graphs, tables, equations, numerical values",
      "Image captioning with Salesforce BLIP; tables as cropped images and structured HTML",
      "Local 384-dimension embeddings with all-MiniLM-L6-v2 and cosine search",
      "Agent pipeline: query, retrieval, evidence, verification and answer agents",
      "Accounts with hashed passwords and per-user isolation of documents and chats",
      "Evaluation, system-health and agent-activity pages",
    ],
    stack: ["Python", "FastAPI", "PyMuPDF", "pdfplumber", "sentence-transformers", "Hugging Face", "Qwen2.5-7B", "BLIP", "SQLite", "React", "Vite", "Tailwind CSS", "Docker"],
    architecture: [
      "React + Vite client — upload, library, explorer, assistant",
      "FastAPI routes — auth, documents, query, agents, evaluation, system",
      "Extractor services — PDF, image, table, graph, numerical, NLP",
      "Embedding service + vector store",
      "Agent orchestrator → retrieval → evidence → verification → answer",
      "Hugging Face router — Qwen2.5-7B-Instruct",
    ],
    contribution: "Repository owner. All 11 commits in the public history are from this account.",
    repo: "https://github.com/Santhosh-Devlops/Multi-Modal-RAG-1",
    demo: null,
    updated: "Sep 2026",
    visual: { kind: "schematic", caption: "Schematic drawn from the repository README and source layout" },
  },
  {
    id: "oracle",
    index: "02",
    title: "ORACLE",
    codename: "Multi-Agent Business Intelligence",
    category: "AI Agents · Analytics",
    tagline: "Eight agents. One rule: numbers come from tools, never from the model.",
    problem: "Asking a language model about business data invites invented numbers. Analysts need profiling, SQL, statistics and forecasts they can trust and audit.",
    solution: "A BI platform where a supervisor coordinates specialist agents. Every figure is computed by Python, DuckDB or statsmodels; the LLM only interprets, and it reports “unavailable” instead of guessing.",
    features: [
      "Upload CSV, XLSX or JSON and profile each column",
      "Safe analytical SQL through DuckDB — only SELECT and WITH are allowed",
      "Statistics, anomaly detection, forecasting and what-if scenarios",
      "Supervisor, Profiling, SQL Analyst, Statistics, Anomaly, Forecasting, Strategy and Critic agents",
      "Every agent run stored with status, duration, retries and errors; full audit log",
      "PDF report generation; light and dark themes",
    ],
    stack: ["Python", "FastAPI", "Pydantic", "SQLAlchemy", "SQLite", "DuckDB", "Pandas", "NumPy", "SciPy", "scikit-learn", "statsmodels", "reportlab", "Hugging Face", "React", "Vite", "Tailwind CSS", "Recharts"],
    architecture: [
      "React + Vite + React Router — 15 routes",
      "FastAPI — datasets, analysis, query, forecasting, scenarios, reports, agents, audit",
      "Tool layer — dataset, SQL, statistics, anomaly, forecast, scenario",
      "Agent supervisor + audit service",
      "Open-model LLM router with controlled fallback",
    ],
    contribution: "Repository owner. The public history is a single initial commit from this account.",
    repo: "https://github.com/Santhosh-Devlops/BI-Forecast-AI",
    demo: null,
    updated: "Sep 2026",
    visual: { kind: "schematic", caption: "Agent topology drawn from the repository README" },
  },
  {
    id: "recruitai",
    index: "03",
    title: "RecruitAI",
    codename: "Explainable Resume Screening",
    category: "Applied ML · NLP",
    tagline: "Semantic matching with a score you can read line by line.",
    problem: "Manual fresher screening is inconsistent: keyword filters miss synonyms, soft-skill claims go unchecked and interview questions stay generic.",
    solution: "Parses resumes, analyses the job description, matches evidence semantically and computes a transparent weighted score in Python. Gemini is used only to draft personalised interview questions.",
    features: [
      "PDF resume parsing with PyMuPDF and skill-synonym normalisation",
      "Semantic matching with sentence-transformers and a TF-IDF fallback",
      "Weighted score: technical 40, projects 25, preferred 15, education 10, soft-skill evidence 10",
      "Capability engine labels each skill Direct, Claim-only or Missing",
      "Candidate ranking with match explanations and skill gaps",
      "Technical, soft-skill and situational questions via Gemini; pytest suite without live API calls",
    ],
    stack: ["Python", "FastAPI", "SQLite", "PyMuPDF", "sentence-transformers", "scikit-learn", "Gemini API", "React", "Vite", "Recharts", "pytest"],
    architecture: [
      "React + Vite client — dashboard, ranking, profile, capability, questions",
      "FastAPI back end — 17 endpoints",
      "Resume parser → JD analyser → skill normaliser",
      "Semantic matcher → scorer → capability engine → ranking",
      "Gemini question generator (back-end key only)",
    ],
    contribution: "Repository owner. All 3 commits in the public history are from this account.",
    repo: "https://github.com/Santhosh-Devlops/Resume-Screener-AI",
    demo: null,
    updated: "Aug 2026",
    visual: { kind: "schematic", caption: "Score weights and thresholds as documented in the README" },
  },
  {
    id: "dymeter",
    index: "04",
    title: "DyMETER",
    codename: "Online Anomaly Detection",
    category: "Machine Learning · Research",
    tagline: "A research paper, rebuilt equation by equation in plain Java.",
    problem: "Streaming data changes its normal behaviour over time. Static detectors mistake new normal patterns for anomalies, or miss anomalies after a drift.",
    solution: "An implementation of the DyMETER framework (Zhu et al., IEEE TPAMI 2026) in dependency-free Java: every paper equation is annotated next to the line that implements it, with a self-test, experiments and a web dashboard.",
    features: [
      "Static Concept-aware Detector — symmetric autoencoder",
      "Intelligent Evolution Controller — evidential deep learning",
      "Dynamic Shift-aware Detector — instance-aware hypernetwork",
      "Dynamic Threshold Optimisation — adaptive decision boundary",
      "AUCROC / AUCPR, ablations, drift generator and robustness studies",
      "Eight-page dashboard with live progress; metrics marked “not scored” instead of invented",
    ],
    stack: ["Java 17", "jdk.httpserver", "Adam optimiser", "PCA", "Python research app", "Spring Boot + React workspace"],
    architecture: [
      "StreamData → preprocessing, PCA",
      "AutoEncoder (SCD) → EvidentialController (IEC)",
      "ShiftHypernetwork (DSD) → DynamicThresholdOptimizer (DTO)",
      "DyMeterEngine — training, inference, drift re-initialisation",
      "Metrics, Ablation, StreamGenerator, DyMeterServer dashboard",
    ],
    contribution: "Repository owner (2 commits on OAD-). The DyMETER algorithm belongs to the paper's authors; this work is an implementation and study of it.",
    repo: "https://github.com/Santhosh-Devlops/OAD-",
    relatedRepos: [
      { label: "Dymeter-MANN-OAD", href: "https://github.com/Santhosh-Devlops/Dymeter-MANN-OAD" },
      { label: "EnhancedDYmeterOAD", href: "https://github.com/Santhosh-Devlops/EnhancedDYmeterOAD" },
    ],
    demo: null,
    updated: "Sep–Oct 2026",
    visual: {
      kind: "image",
      src: "/images/projects/03_score_threshold_timeline.png",
      alt: "Chart of anomaly score against an adaptive threshold, with flagged rows marked",
      caption: "Real output — score and threshold timeline from a run in Dymeter-MANN-OAD",
    },
  },
];

export const education = [
  { years: "2023 — 2027", title: "B.Tech Information Technology", place: "Mepco Schlenk Engineering College, Sivakasi", detail: "CGPA 8.27 / 10" },
  { years: "2022 — 2023", title: "Higher Secondary Certificate", place: "Maharishi Vidya Mandir Senior Secondary School, Madurai", detail: "81.2%" },
];

export const achievements = [
  { date: "Mar 2025", title: "III Place — Techno Script IEEE Presentation", place: "Thiagarajar College of Engineering, Madurai", tier: "podium" as const },
  { date: "2025", title: "IV Place · ₹2,000 prize — Oblivion 2K25", place: "30-hour national hackathon, SNS College of Technology", tier: "podium" as const },
  { date: "2026", title: "36-hour national hackathon — AI-powered Tutor", place: "M. Kumaraswamy College of Engineering", tier: "build" as const },
];

export type Cert = { title: string; issuer: string; date: string; glyph: GlyphName; group: "ai" | "data" | "dev" | "comm" };

export const certifications: Cert[] = [
  { title: "AWS Certified AI Practitioner", issuer: "Amazon Web Services", date: "Feb 2026", glyph: "cloud", group: "ai" },
  { title: "Agents and Workflows", issuer: "OpenAI", date: "Jun 2026", glyph: "agents", group: "ai" },
  { title: "Applied AI Foundations", issuer: "OpenAI", date: "Jun 2026", glyph: "neural", group: "ai" },
  { title: "AI Fluency for Small Businesses", issuer: "Anthropic + PayPal", date: "Jun 2026", glyph: "spark", group: "ai" },
  { title: "Generative AI", issuer: "LinkedIn", date: "Jun 2026", glyph: "spark", group: "ai" },
  { title: "Affective Computing", issuer: "IIT Kharagpur", date: "Mar 2026", glyph: "eye", group: "ai" },
  { title: "Data Analytics with Python", issuer: "IIT Kharagpur", date: "Jan 2025", glyph: "bars", group: "data" },
  { title: "Frontend for Java Full Stack Development", issuer: "Coursera", date: "Jan 2025", glyph: "layers", group: "dev" },
  { title: "English for Technical Professionals", issuer: "IEEE", date: "Jan 2024", glyph: "signal", group: "comm" },
];

export const internships = [
  { title: "GenAI Powered Data Analytics", issuer: "Tata Technologies", date: "Jun 2026", kind: "Virtual internship" },
  { title: "Cyber Job Simulation", issuer: "Deloitte", date: "Jun 2026", kind: "Virtual job simulation" },
];

export const universe = [
  { id: "ai", label: "Artificial Intelligence", note: "RAG, agents, LLM integration" },
  { id: "se", label: "Software Engineering", note: "Tested, modular back ends" },
  { id: "fs", label: "Full Stack Development", note: "React front ends on FastAPI" },
  { id: "ml", label: "Machine Learning", note: "Autoencoders, semantic matching" },
  { id: "auto", label: "Intelligent Automation", note: "Screening, reporting, alerts" },
  { id: "ps", label: "Problem Solving", note: "DSA practice, hackathons" },
  { id: "pd", label: "Product Development", note: "Dashboards people can use" },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "credentials", label: "Credentials" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];
