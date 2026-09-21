export const experiences = [
  {
    period: "Mai 2024 — Atual",
    role: "Sócio & Full Stack Developer",
    company: "Aurea Robotics Ltda",
    location: "Rio de Janeiro",
    highlights: [
      "Arquitetura e evolução de serviços backend em Python com Redis Streams (payroll_queue e múltiplos robôs por processo)",
      "Criação e evolução de APIs REST e aplicações web de alta disponibilidade",
      "Automação de processos (RPA) com Playwright/Pyppeteer — redução direta de esforço operacional",
      "Modelagem e migração de bancos SQL e NoSQL, dashboards operacionais e observabilidade em produção",
      "Ambientes conteinerizados com Docker/Kubernetes, CI/CD e suporte a produção",
    ],
    yin: "Produto & Autonomia",
    yang: "Operação & Escala",
  },
  {
    period: "Jun 2019 — Abr 2024",
    role: "Full Stack Developer",
    company: "MVP Systems (MEI)",
    location: "Rio de Janeiro",
    highlights: [
      "Prestação de serviços para sistemas corporativos — APIs, Web Apps e RPA sob medida",
      "Backend com Redis Streams, deploy e versionamento em teste e produção",
      "Pipelines CI/CD, monitoramento e resposta a incidentes",
      "Migração e manutenção contínua de bancos de dados",
    ],
    yin: "Entrega & Cliente",
    yang: "Estabilidade & Evolução",
  },
  {
    period: "Mar 2018 — Mai 2019",
    role: "Estagiário em Desenvolvimento",
    company: "Aurea Robotics Ltda",
    location: "Rio de Janeiro",
    highlights: [
      "Apoio no desenvolvimento web, APIs e rotinas backend em Python com Redis Streams",
      "Automação RPA e correção de bugs em produção",
    ],
    yin: "Aprender",
    yang: "Fazer",
  },
]

export const stackGroups = [
  {
    label: "Linguagens",
    yin: "Lógica",
    items: ["Python", "Go", "TypeScript", "JavaScript", "Rust — familiaridade"],
  },
  {
    label: "Backend",
    yin: "Sistema",
    items: ["FastAPI", "Flask", "REST APIs", "Auth & RBAC", "Redis"],
  },
  {
    label: "Frontend",
    yin: "Interface",
    items: ["React", "Vue.js", "Tailwind", "HTML/CSS"],
  },
  {
    label: "Dados & IA",
    yin: "Conhecimento",
    items: ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "pgvector / Chroma / Zvec", "RAG", "LLMs", "AI Agents"],
  },
  {
    label: "Infra & Observabilidade",
    yin: "Confiabilidade",
    items: ["Docker", "Kubernetes", "Linux / systemd", "CI/CD", "OpenObserve", "Datadog", "Sentry", "Graylog"],
  },
  {
    label: "Automação",
    yin: "Precisão",
    items: ["Playwright", "Pyppeteer", "Requests", "Bash/Shell", "Automação de Desktop"],
  },
]

export const projects = [
  {
    id: "payroll-orchestrator",
    title: "Payroll Orchestrator",
    category: "Backend · RPA · Redis Streams",
    description: "Orquestração de folha com filas assíncronas — múltiplos robôs por processo consumindo payroll_queue, com retry, idempotência e observabilidade ponta-a-ponta.",
    tech: ["Python", "Redis Streams", "PostgreSQL", "Docker", "OpenObserve"],
    year: "2024",
    accent: "dark",
  },
  {
    id: "rpa-ops-hub",
    title: "RPA Ops Hub",
    category: "Automação · Web Platform",
    description: "Hub para criação, agendamento e monitoramento de robôs — dashboards operacionais, logs estruturados e troubleshooting em produção.",
    tech: ["Python", "FastAPI", "Vue.js", "Playwright", "Kubernetes"],
    year: "2023",
    accent: "light",
  },
  {
    id: "api-ecosystem",
    title: "Ecossistema de APIs",
    category: "Arquitetura · Clean Arch",
    description: "Conjunto de APIs REST com autenticação, versionamento e contratos estáveis — do levantamento de requisitos ao deploy com CI/CD.",
    tech: ["Go", "TypeScript", "PostgreSQL", "GitLab CI"],
    year: "2022",
    accent: "dark",
  },
  {
    id: "ai-agent-workflows",
    title: "Agentic Workflows",
    category: "IA · RAG · Agents",
    description: "Workflows com LLMs, RAG e coding agents — ingestão, vetorização (pgvector/Chroma) e orquestração de tarefas autônomas.",
    tech: ["Python", "pgvector", "LLM APIs", "RAG"],
    year: "2024",
    accent: "light",
  },
]

export const education = [
  { degree: "Bacharel em Sistemas de Informação", school: "Estácio de Sá", period: "2017 — 2020" },
  { degree: "Técnico em Informática", school: "FAETEC", period: "2010 — 2012" },
]
