import type { IconName } from "@/components/ui/Icon";

/* ------------------------------------------------------------------ */
/* Challenges: the five entry points used by the hero picker, the     */
/* "Challenges" mega menu, the lifecycle panel, the form and footer.  */
/* ------------------------------------------------------------------ */

export type ChallengeId = "q1" | "q2" | "q3" | "q4" | "q5";
export type Tone = "accent" | "green" | "violet" | "ink" | "orange";

export interface Challenge {
  id: ChallengeId;
  question: string;
  label: string;
  slug: string;
  icon: IconName;
  tone: Tone;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "q1",
    question: "We know AI can help, but where should we start?",
    label: "Enterprise AI Strategy",
    slug: "where-to-start",
    icon: "bulb",
    tone: "accent",
  },
  {
    id: "q2",
    question: "Our AI pilots aren’t reaching production.",
    label: "AI PoC-to-Production",
    slug: "ai-pilot-to-production",
    icon: "rocket",
    tone: "green",
  },
  {
    id: "q3",
    question: "How can we make sense of complex, unstructured, and growing data?",
    label: "AI-Ready Data Foundation",
    slug: "ai-ready-data",
    icon: "database",
    tone: "violet",
  },
  {
    id: "q4",
    question: "How do we make AI secure, compliant and controllable?",
    label: "AI Security & Governance",
    slug: "ai-security-compliance",
    icon: "shieldCheck",
    tone: "ink",
  },
  {
    id: "q5",
    question: "Our AI costs are growing, but the value isn’t clear.",
    label: "AI Value Optimization",
    slug: "ai-value",
    icon: "trend",
    tone: "orange",
  },
];

export const challengeById = Object.fromEntries(CHALLENGES.map((c) => [c.id, c])) as Record<
  ChallengeId,
  Challenge
>;

/* ------------------------------------------------------------------ */
/* Solutions (ten, in three groups)                                    */
/* ------------------------------------------------------------------ */

export interface Solution {
  title: string;
  blurb: string;
  slug: string;
  icon: IconName;
}

export interface SolutionGroup {
  title: string;
  items: Solution[];
}

export const SOLUTION_GROUPS: SolutionGroup[] = [
  {
    title: "Build and scale AI",
    items: [
      { title: "AI-to-Production", blurb: "Take AI from pilot to secure production", slug: "ai-implementation-services", icon: "rocket" },
      { title: "Enterprise AI Solutions", blurb: "End-to-end enterprise AI, idea to scale", slug: "enterprise-ai-solutions", icon: "hexagon" },
      { title: "Agentic Operations", blurb: "AI agents that run real workflows", slug: "agentic-ai", icon: "robot" },
      { title: "Workflow Automation", blurb: "Automate work across your systems", slug: "enterprise-workflow-automation", icon: "flow" },
    ],
  },
  {
    title: "Data and cloud",
    items: [
      { title: "AI-Ready Data Foundation", blurb: "Data platforms and pipelines for AI", slug: "data-engineering-services", icon: "database" },
      { title: "AI Cloud & Reliability", blurb: "Cloud, DevOps and MLOps for AI", slug: "ai-cloud-engineering", icon: "cloud" },
    ],
  },
  {
    title: "Trust and quality",
    items: [
      { title: "AI Security & Governance", blurb: "Secure, compliant, controllable AI", slug: "ai-security-governance", icon: "shield" },
      { title: "AI Testing", blurb: "Test AI systems before launch", slug: "ai-testing-services", icon: "flask" },
      { title: "AI Quality Engineering", blurb: "AI-powered QA for your software", slug: "ai-quality-engineering", icon: "check" },
      { title: "Web3 & Decentralized AI", blurb: "Blockchain, Web3 and decentralized AI", slug: "blockchain-web3-solutions", icon: "blocks" },
    ],
  },
];

export const ALL_SOLUTIONS = SOLUTION_GROUPS.flatMap((g) => g.items);

/* ------------------------------------------------------------------ */
/* Capabilities & Solutions (four categories, with longer copy)         */
/* ------------------------------------------------------------------ */

export interface Capability {
  title: string;
  text: string;
  tone: "accent" | "violet" | "green" | "orange";
  items: { title: string; text: string; slug: string; icon: IconName }[];
}

export const CAPABILITIES: Capability[] = [
  {
    title: "Build & Scale AI",
    text: "Transform models from lab experiments into resilient, revenue-generating enterprise software with our AI/ML services.",
    tone: "accent",
    items: [
      {
        title: "AI Implementation Services",
        text: "Deploy production-grade machine learning models into live environments with hardened security, minimal latency, and measurable business ROI.",
        slug: "ai-implementation-services",
        icon: "rocket",
      },
      {
        title: "Enterprise Intelligence",
        text: "Unify predictive analytics and custom LLMs across operational workflows to accelerate executive decision-making and automate complex problem-solving.",
        slug: "enterprise-ai-solutions",
        icon: "hexagon",
      },
      {
        title: "Agentic Operations",
        text: "Deploy autonomous AI agents that orchestrate multi-step business logic, interact with enterprise software, and execute complex workflows reliably.",
        slug: "agentic-ai",
        icon: "robot",
      },
      {
        title: "Workflow Automation",
        text: "Eliminate manual bottlenecks with enterprise workflow automation that integrates intelligent agents across legacy architectures, enterprise ERPs, and modern cloud applications.",
        slug: "enterprise-workflow-automation",
        icon: "flow",
      },
    ],
  },
  {
    title: "Data Engineering & Cloud Infrastructure",
    text: "Build the high-throughput, governed pipelines through specialized data engineering services and resilient cloud architectures.",
    tone: "violet",
    items: [
      {
        title: "AI-Ready Data Foundation",
        text: "Consolidate siloed enterprise data into structured, clean, and vector-indexed pipelines ready for high-accuracy model training and retrieval.",
        slug: "data-engineering-services",
        icon: "database",
      },
      {
        title: "AI Cloud & Reliability",
        text: "Combine AI cloud engineering, continuous MLOps pipelines, and infrastructure guardrails for zero-downtime model serving at scale.",
        slug: "ai-cloud-engineering",
        icon: "cloud",
      },
    ],
  },
  {
    title: "Trust, Quality & Verification",
    text: "De-risk deployment through comprehensive compliance, model security, and quality assurance.",
    tone: "green",
    items: [
      {
        title: "AI Security & Governance",
        text: "Protect proprietary intellectual property, eliminate hallucinations, and enforce strict regulatory compliance through continuous model monitoring and guardrails.",
        slug: "ai-security-governance",
        icon: "shield",
      },
      {
        title: "AI Testing",
        text: "Stress-test model accuracy, safety limits, and edge-case behavior before launch to prevent hallucination, drift, and unexpected runtime failures.",
        slug: "ai-testing-services",
        icon: "flask",
      },
      {
        title: "AI Quality Engineering",
        text: "Accelerate traditional software release cycles using AI-driven automated testing, intelligent test design, and continuous regression analysis.",
        slug: "ai-quality-engineering",
        icon: "check",
      },
    ],
  },
  {
    title: "Decentralized Architecture",
    text: "Ensure tamper-proof provenance, data sovereignty, and distributed execution.",
    tone: "orange",
    items: [
      {
        title: "Web3 & Decentralized AI",
        text: "Combine distributed ledgers with artificial intelligence to ensure cryptographic data provenance, secure compute sharing, and verifiable model execution.",
        slug: "blockchain-web3-solutions",
        icon: "blocks",
      },
    ],
  },
];

export const INDUSTRIES: { name: string; icon: IconName }[] = [
  { name: "Healthcare", icon: "medical" },
  { name: "Logistics & Supply Chain", icon: "truck" },
  { name: "Fintech", icon: "card" },
  { name: "EdTech", icon: "gradCap" },
  { name: "Real Estate", icon: "house" },
  { name: "Manufacturing", icon: "factory" },
  { name: "Insurance", icon: "umbrella" },
  { name: "Construction", icon: "hardHat" },
  { name: "Government", icon: "columns" },
];

/* ------------------------------------------------------------------ */
/* Hero + trust                                                         */
/* ------------------------------------------------------------------ */

export const CLIENTS = [
  "MetLife",
  "IHG",
  "Schreiber",
  "Boldt",
  "Greensight",
  "CoOptimal",
  "Pratham International",
  "Ceretech",
  "Colossal",
  "Faith",
  "Tweet/Garot",
];

/* ------------------------------------------------------------------ */
/* Platforms: stack, PRISM AI trace, DevForge.ai orbit                  */
/* ------------------------------------------------------------------ */

export const STACK = ["AI", "Data", "Engineering", "Cloud", "Security", "Governance", "Automation"];

export const PRISM_CHIPS = ["Tracing", "Evaluations", "Prompt management", "Cost tracking", "Audit trail"];

/** One request through the customer assistant: offset/width are % of the total trace. */
export const PRISM_TRACE = [
  { step: "Input guardrail", offset: 0, width: 5, ms: 12 },
  { step: "Retrieve 3 sources", offset: 5, width: 15, ms: 140 },
  { step: "Model call", offset: 20, width: 64, ms: 820 },
  { step: "Output check · PII", offset: 84, width: 6, ms: 9 },
];

export interface DevForgeProduct {
  name: string;
  path: string;
}

/** Six products sit on the inner ring, eight on the outer ring. */
export const DEVFORGE_INNER: DevForgeProduct[] = [
  { name: "Autonomo AI", path: "autonomoai" },
  { name: "Agent-Pipeline", path: "agent-pipeline" },
  { name: "Pulse-Ai", path: "pulse-ai" },
  { name: "STAGE", path: "demo-agent" },
  { name: "REX", path: "rex" },
  { name: "VIRA", path: "vira" },
];

export const DEVFORGE_OUTER: DevForgeProduct[] = [
  { name: "IAN", path: "ian" },
  { name: "ThinkDocs", path: "think-docs" },
  { name: "Alluvium", path: "alluvium" },
  { name: "Presales", path: "presales" },
  { name: "PropIQ", path: "prop-iq" },
  { name: "Review Attendant", path: "review-attendant" },
  { name: "AttendAI", path: "attendai" },
  { name: "ELVIS", path: "elvis" },
];

/* ------------------------------------------------------------------ */
/* Lifecycle                                                            */
/* ------------------------------------------------------------------ */

export interface LifecycleStage {
  name: string;
  focus: string;
  /** Engineering execution: what we do in this stage. */
  execution: string;
  outcome: string;
  /** "Solves": links to the pages this stage addresses, with the label to show. */
  solves: { label: string; slug: string }[];
}

export const LIFECYCLE: LifecycleStage[] = [
  {
    name: "Discover",
    focus: "Commercial Feasibility & Technical Scoping",
    execution:
      "We audit data readiness, legacy architecture constraints, and operational bottlenecks to define technically viable, high-ROI target applications.",
    outcome: "Identify the right problems",
    solves: [{ label: "Enterprise AI Strategy & Opportunity Mapping", slug: "where-to-start" }],
  },
  {
    name: "Strategize",
    focus: "Use-Case Prioritization & Commercial Roadmapping",
    execution:
      "We map technical dependencies against business urgency, defining delivery milestones, infrastructure resource requirements, and risk thresholds.",
    outcome: "A clear transformation plan",
    solves: [
      { label: "Enterprise AI Strategy", slug: "where-to-start" },
      { label: "AI Value & Cost Optimization", slug: "ai-value" },
    ],
  },
  {
    name: "Architect",
    focus: "Platform, Vector, & Infrastructure Design",
    execution:
      "We design production data pipelines, foundation model integration layers, vector storage, and zero-trust security postures.",
    outcome: "An implementation blueprint",
    solves: [
      { label: "AI-Ready Data Foundation", slug: "ai-ready-data" },
      { label: "AI PoC-to-Production", slug: "ai-pilot-to-production" },
    ],
  },
  {
    name: "Build",
    focus: "Full-Stack AI/ML development & Data Pipeline Engineering",
    execution:
      "We develop clean data ingestion flows, train or fine-tune task-specific models, build retrieval pipelines (RAG), and deploy autonomous workflow agents.",
    outcome: "A production-grade solution",
    solves: [
      { label: "AI-Ready Data Foundation", slug: "ai-ready-data" },
      { label: "AI PoC-to-Production", slug: "ai-pilot-to-production" },
    ],
  },
  {
    name: "Deploy",
    focus: "Cloud, DevOps, MLOps, Orchestration, & System Integration",
    execution:
      "We automate continuous delivery pipelines (CI/CD/CT), containerized model serving, fallback routing, and latency-budget monitoring.",
    outcome: "Complete deployment",
    solves: [{ label: "AI PoC-to-Production Integration", slug: "ai-pilot-to-production" }],
  },
  {
    name: "Govern",
    focus: "Model Safety, Guardrails, & Auditability",
    execution:
      "We implement continuous red-teaming, automated prompt-injection defenses, drift monitoring, and compliance logging across the full stack.",
    outcome: "Secure and compliant operations",
    solves: [{ label: "AI Security & Enterprise Governance", slug: "ai-security-compliance" }],
  },
  {
    name: "Scale",
    focus: "Compute Optimization, FinOps, & Continuous Learning",
    execution:
      "We run model quantization, caching strategies, active inference tuning, and sustained multi-tenant infrastructure support.",
    outcome: "Sustainable enterprise adoption",
    solves: [
      { label: "AI Value Optimization", slug: "ai-value" },
      { label: "AI Implementation", slug: "ai-implementation-services" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Why MoogleLabs                                                       */
/* ------------------------------------------------------------------ */

export interface Differentiator {
  icon: IconName;
  tone: "b" | "g" | "v" | "o" | "d";
  title: string;
  text: string;
  short: string;
  dark?: boolean;
}

export const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: "clock",
    tone: "b",
    title: "Business problem first, technology second",
    text: "We start with the commercial outcome you need, then engineer the stack that achieves it.",
    short: "Outcome-led, not technology-led",
  },
  {
    icon: "rocket",
    tone: "d",
    dark: true,
    title: "PoC-to-production ownership",
    text: "We bridge the gap between experimental prototypes and dependable, mission-critical systems.",
    short: "We stay through the hard part",
  },
  {
    icon: "unlock",
    tone: "v",
    title: "Full IP ownership & architectural independence",
    text: "You retain 100% ownership of your custom models, data pipelines, and codebase; built on open, portable standards without proprietary platform traps.",
    short: "Zero vendor lock-in",
  },
  {
    icon: "databaseHalf",
    tone: "g",
    title: "AI and data foundation together",
    text: "Data engineering, knowledge retrieval layers, and security controls built alongside the model.",
    short: "The foundation, not just the interface",
  },
  {
    icon: "shield",
    tone: "o",
    title: "Enterprise-grade by design",
    text: "Model guardrails, zero-trust security, cost optimization, and observability embedded from day one.",
    short: "Production-ready from the first commit",
  },
  {
    icon: "trend",
    tone: "b",
    title: "From one use case to an operating model",
    text: "Once initial value is proven, we establish the platform architecture to scale AI across the enterprise.",
    short: "Point solutions to an AI-enabled enterprise",
  },
];

/* ------------------------------------------------------------------ */
/* Operating model                                                      */
/* ------------------------------------------------------------------ */

export const OM_STAGES = [
  { title: "AI experiments", text: "Promising pilots, each built on its own." },
  { title: "Repeatable AI capability", text: "Shared data, platforms, governance and patterns the next use case reuses." },
  { title: "AI-enabled enterprise", text: "AI running across business functions, measured, governed and improving." },
];

export const OM_ROWS: { label: string; cells: [string, string, string] }[] = [
  { label: "Architecture", cells: ["Designed for one use case", "Reference architecture, reused", "One enterprise AI platform"] },
  { label: "Data foundation", cells: ["Data for one use case", "Shared, governed data products", "Trusted knowledge layer"] },
  { label: "Governance", cells: ["Controls built in from day one", "Standard approval path", "One model for every use case"] },
  { label: "Reusable components", cells: ["First connectors and guardrails", "Component library", "New use cases in weeks"] },
  { label: "Engineering practices", cells: ["CI/CD and evaluation", "LLMOps on every release", "AI Center of Excellence"] },
];

/* ------------------------------------------------------------------ */
/* Work (placeholder case studies, as on the original page)             */
/* ------------------------------------------------------------------ */

export const CASES = [
  { industry: "Insurance", result: "[x]%" },
  { industry: "Hospitality", result: "[x]×" },
  { industry: "Manufacturing", result: "$[x]" },
];

/* ------------------------------------------------------------------ */
/* FAQ (client copy, verbatim)                                          */
/* ------------------------------------------------------------------ */

export const FAQS: { q: string; a: string }[] = [
  {
    q: "How do you ensure our AI pilots actually reach production instead of stalling in testing?",
    a: "Most proofs-of-concept fail because they are built in isolated sandboxes without accounting for live data pipelines, latency budgets, or security requirements. We engineer for production constraints from day one, building data ingestion, MLOps deployment pipelines, automated testing, and fallback routing concurrently with the model so your system integrates cleanly into existing enterprise infrastructure.",
  },
  {
    q: "Who owns the intellectual property, custom models, and codebase once a project is delivered?",
    a: "You retain 100% ownership of all custom code, fine-tuned weights, data pipelines, and architectural documentation. We build on open, portable cloud and MLOps frameworks with zero proprietary vendor lock-in, ensuring your internal teams can maintain, audit, and extend the platform independently.",
  },
  {
    q: "How do you protect proprietary enterprise data, prevent model hallucinations, and ensure compliance?",
    a: "Governance is embedded across every stage of delivery rather than treated as a post-launch checklist. We deploy private VPC or on-premise model hosting so your data never trains public third-party models, enforce Retrieval-Augmented Generation (RAG) grounded strictly in verified enterprise sources, and implement automated guardrails, red-teaming, and audit logging aligned with your regulatory standards.",
  },
  {
    q: "Our enterprise data is currently fragmented across legacy systems. Can we still start an AI initiative?",
    a: "Yes. You do not need a multi-year data warehouse overhaul before capturing AI value. Our data engineering team builds targeted, AI-ready ingestion and vector pipelines specifically scoped to the workflows required for your initial use cases. This allows you to launch securely while modernizing your broader data foundation incrementally.",
  },
  {
    q: "How do you keep cloud compute and LLM inference costs from spiraling as usage grows?",
    a: "We incorporate AI FinOps directly into our architecture. Rather than defaulting to oversized, expensive foundation models for every task, we optimize unit economics through right-sized small language models (SLMs), model quantization, semantic caching, and intelligent query routing. This ensures infrastructure costs scale predictably alongside business value.",
  },
  {
    q: "How does MoogleLabs differ from traditional IT staffing agencies or niche AI boutiques?",
    a: "Staffing agencies supply disconnected headcount without architectural accountability, while niche AI boutiques often lack the enterprise engineering depth required for cloud security, legacy ERP integration, and quality assurance. We provide a single, accountable team covering the full stack: data engineering, AI/ML development, cloud MLOps, security governance, and automated QA.",
  },
  {
    q: "What does a typical engagement look like, and how quickly can we see measurable results?",
    a: "Engagements are structured around your current maturity. For organizations defining their roadmap, a fixed-scope 2 to 4 week AI Readiness & Strategy Sprint validates feasibility and ROI. For defined initiatives, production-grade deployments typically reach live operational environments within 8 to 16 weeks, using milestone-based delivery so you see working capability early.",
  },
];
