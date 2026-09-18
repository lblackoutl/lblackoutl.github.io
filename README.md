# Marcus Pereira — Portfólio

Portfólio single-page com tema Yin Yang, desenvolvido com React 19, TypeScript, Vite e Tailwind CSS.

## Tecnologias

- **React** + **React DOM** — UI
- **TypeScript** — tipagem estática
- **Vite** + **@vitejs/plugin-react** — build
- **Tailwind CSS** (+ `@tailwindcss/postcss`, PostCSS) — estilização
- **motion** — animações
- **lenis** — smooth scroll

## Estrutura

```
├── index.html          # HTML + fonts (Google Fonts) + favicon Yin Yang
├── postcss.config.js   # PostCSS (@tailwindcss/postcss)
├── src/
│   ├── App.tsx         # Aplicação (single component: loader, nav, hero, manifesto, experiência, stack, projetos, contato)
│   ├── data/index.ts   # Experiências, stack, projetos, formação
│   ├── index.css       # Tailwind v4 (@import "tailwindcss" + @theme) e estilos globais
│   └── main.tsx        # Entrada React
├── eslint.config.js
├── tsconfig.json / tsconfig.node.json
└── vite.config.ts
```

## Como executar

Pré-requisitos: Node.js 20.19+ (recomendado 22.12+) e npm.

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # type-check (tsc) + build de produção em dist/
npm run preview  # serve o build de produção
npm run lint     # ESLint
```

## Notas

- O build gera `dist/` (ignorado pelo git, regenerado via `npm run build`).
- `src/data/index.ts` centraliza todo o conteúdo editável (experiências, stack, projetos, formação).
- As fontes (Bricolage Grotesk, Instrument Serif, JetBrains Mono, Space Grotesk) são carregadas via Google Fonts em `index.html` e mapeadas como `font-display` / `font-serif` / `font-mono` no `@theme` em `src/index.css`.
