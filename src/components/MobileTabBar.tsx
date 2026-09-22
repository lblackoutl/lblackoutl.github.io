import { useEffect, useState } from "react"

function TabIcon({ children, className = "w-5 h-5 shrink-0" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  )
}

const SECTIONS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "inicio", label: "Início", icon: (<><path d="m4 11 8-7 8 7" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-5h4v5" /></>) },
  { id: "sobre", label: "Sobre", icon: (<><circle cx="12" cy="8" r="3.5" /><path d="M5 19c1.2-3.2 3.9-5 7-5s5.8 1.8 7 5" /></>) },
  { id: "experiencia", label: "Experiência", icon: (<><rect x="4" y="8" width="16" height="12" rx="2.5" /><path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" /><path d="M4 12.5h16" /></>) },
  { id: "stack", label: "Stack", icon: (<><path d="m12 3.5 9 4.5-9 4.5-9-4.5 9-4.5Z" /><path d="m4.5 11.5 7.5 3.7 7.5-3.7" /><path d="m4.5 15 7.5 3.7 7.5-3.7" /></>) },
  { id: "projetos", label: "Projetos", icon: (<><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>) },
  { id: "contato", label: "Contato", icon: (<><rect x="3.5" y="6" width="17" height="12" rx="2.5" /><path d="m5 8.5 7 5 7-5" /></>) },
]

// ── mobile tab bar ──────────────────────────────────────────────
// Componente isolado: o scroll-spy mora aqui, então cada troca de seção
// re-renderiza só a pílula — não a página inteira (mesmo visual).
export function MobileTabBar() {
  const [activeSection, setActiveSection] = useState("")

  // scroll spy — vence a seção com maior visibilidade na faixa central
  // da tela (evita piscar entre seções no scroll rápido).
  // Guarda funcional: só troca de estado se a vencedora mudou.
  useEffect(() => {
    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best = ""
        let bestRatio = 0
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        })
        if (best) setActiveSection((prev) => (prev === best ? prev : best))
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.5, 1] }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="Navegação principal" className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1.5rem)]">
      <div className="flex items-center gap-1 rounded-full bg-white/85 border border-black/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.14)] p-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)' }}>
        {SECTIONS.map((s) => {
          const active = activeSection === s.id
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-instant
              aria-label={s.label}
              aria-current={active ? true : undefined}
              className={`flex shrink-0 items-center rounded-full px-2.5 py-2 text-[12px] font-medium overflow-hidden transition-colors duration-200 ${active ? "bg-ink text-white gap-2" : "text-black/50 gap-0 active:bg-black/[0.06]"}`}
            >
              <TabIcon className="w-6 h-6 md:w-7 md:h-7 shrink-0">{s.icon}</TabIcon>

              <span
                aria-hidden={active ? undefined : true}
                className={`whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? "max-w-[90px] opacity-100" : "max-w-0 opacity-0"}`}
              >
                {s.label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
