/**
 * The inner pages (ported from the staging site). Each page's body is in
 * src/content/pages/<slug>.html; its route is src/app/(solutions|challenges)/<slug>/page.tsx.
 * Titles are the original page titles; descriptions are the hero introductions.
 */
export type InnerFamily = "solution" | "challenge";

export interface InnerPageMeta {
  slug: string;
  title: string;
  description: string;
  family: InnerFamily;
}

export const INNER_PAGES: Record<string, InnerPageMeta> = {
  "where-to-start": {
    "slug": "where-to-start",
    "title": "Where Should We Start With AI",
    "description": "Share an idea, a challenge or just a goal. In 4 weeks we turn it into a working proof of concept, tested with your users, and a business case your leadership…",
    "family": "challenge"
  },
  "ai-pilot-to-production": {
    "slug": "ai-pilot-to-production",
    "title": "Take Your AI Pilot to Production",
    "description": "Share your pilot. We review it first, then share a detailed, evaluated plan for taking it live: integrations, guardrails, testing, monitoring and cost control.",
    "family": "challenge"
  },
  "ai-ready-data": {
    "slug": "ai-ready-data",
    "title": "Make Sense of Complex Data for AI",
    "description": "Share where your data lives today. In [2] weeks you get a readiness score for your priority AI use case, then the data layers that turn documents, emails and…",
    "family": "challenge"
  },
  "ai-security-compliance": {
    "slug": "ai-security-compliance",
    "title": "Make AI Secure, Compliant and Controllable",
    "description": "Share where AI is used in your business. In [3&#8211;4] weeks we find every AI system, classify its risk, and put controls and audit-ready evidence in place…",
    "family": "challenge"
  },
  "ai-value": {
    "slug": "ai-value",
    "title": "Show the Value of Your AI Spend",
    "description": "Share what you run today. In [2&#8211;3] weeks we show what every AI system costs and what it returns, then cut waste without hurting quality, tracked in PRISM…",
    "family": "challenge"
  },
  "ai-implementation-services": {
    "slug": "ai-implementation-services",
    "title": "AI Implementation Services",
    "description": "A proof of concept works on sample data in an isolated sandbox. Enterprise production demands live data pipelines, deep ERP/CRM integration, security…",
    "family": "solution"
  },
  "enterprise-ai-solutions": {
    "slug": "enterprise-ai-solutions",
    "title": "Enterprise AI Solutions",
    "description": "We help enterprises identify high-value use cases, unify fragmented data, and engineer secure, governed enterprise intelligence solutions that run reliably…",
    "family": "solution"
  },
  "agentic-ai": {
    "slug": "agentic-ai",
    "title": "AI Agent Development Services",
    "description": "We design, engineer, and run production-grade agentic AI solutions that complete multi-step business workflows inside your ERP, CRM, and service platforms.",
    "family": "solution"
  },
  "enterprise-workflow-automation": {
    "slug": "enterprise-workflow-automation",
    "title": "Enterprise Workflow Automation",
    "description": "We automate workflows end to end across your systems, combining integration, document AI, business rules, RPA and AI agents, so work flows from intake to…",
    "family": "solution"
  },
  "data-engineering-services": {
    "slug": "data-engineering-services",
    "title": "Data Engineering Services",
    "description": "Great AI fails on broken data. Our data engineering services unify, clean, and govern your pipelines so AI ships faster and scales safely.",
    "family": "solution"
  },
  "ai-cloud-engineering": {
    "slug": "ai-cloud-engineering",
    "title": "AI Cloud Engineering",
    "description": "We build and run the cloud platforms behind production AI: model serving, MLOps and LLMOps pipelines, observability and cost control on AWS, Azure, Google…",
    "family": "solution"
  },
  "ai-security-governance": {
    "slug": "ai-security-governance",
    "title": "AI Security & Governance Services",
    "description": "We govern the data that feeds your AI, secure the models and agents that use it, and produce the evidence regulators and auditors ask for, so you can scale AI…",
    "family": "solution"
  },
  "ai-testing-services": {
    "slug": "ai-testing-services",
    "title": "AI Testing Services",
    "description": "Prove your AI is accurate, safe, fair and robust before your users test it for you. We evaluate models, RAG applications and AI agents against measurable…",
    "family": "solution"
  },
  "ai-quality-engineering": {
    "slug": "ai-quality-engineering",
    "title": "AI Quality Engineering",
    "description": "We use AI to design tests, generate test data, keep automation working when apps change, and find defects earlier, so releases speed up without quality…",
    "family": "solution"
  },
  "blockchain-web3-solutions": {
    "slug": "blockchain-web3-solutions",
    "title": "Blockchain, Web3 & Decentralized AI Solutions",
    "description": "We help enterprises and Web3 builders find where decentralization creates real value, design the right chain and token architecture, engineer audited smart…",
    "family": "solution"
  }
};
