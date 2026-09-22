import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react"
import Lenis from "lenis"
import { experiences, stackGroups, projects, education } from "./data"
import { Reveal } from "./components/Reveal"
import { MagneticButton } from "./components/MagneticButton"
import { MobileTabBar } from "./components/MobileTabBar"
import { ProcessSteps } from "./components/ProcessSteps"
import { YinYang, YinYangPlanet } from "./components/YinYang"

// ── main ──────────────────────────────────────────────────────
export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Lenis — ref compartilhada p/ scroll suave programático (tab bar, âncoras)
  const lenisRef = useRef<Lenis | null>(null)
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // âncoras internas (#...): scroll suave via Lenis — exceto [data-instant],
  // que salta direto p/ a seção sem passar pelas intermediárias (tab bar)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const lenis = lenisRef.current
      if (!lenis) return
      const hash = anchor.getAttribute("href")
      if (!hash) return
      e.preventDefault()
      const instant = anchor.hasAttribute("data-instant")
      if (hash === "#") {
        if (instant) lenis.scrollTo(0, { immediate: true })
        else lenis.scrollTo(0, { duration: 1.4 })
        return
      }
      const el = document.querySelector(hash)
      if (el) {
        if (instant) lenis.scrollTo(el as HTMLElement, { immediate: true })
        else lenis.scrollTo(el as HTMLElement, { duration: 1.4 })
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  // loader: dispensa quando página+fontes prontas (mín 800ms de intro, teto 2s)
  useEffect(() => {
    const start = performance.now()
    let finished = false
    let waitId = 0
    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, 800 - (performance.now() - start))
      waitId = window.setTimeout(() => setLoaderDone(true), wait)
    }
    const capId = window.setTimeout(finish, 2000) // teto de segurança
    document.fonts?.ready.then(finish).catch(() => {})
    if (document.readyState === "complete") {
      finish()
    } else {
      window.addEventListener("load", finish, { once: true })
    }
    return () => {
      window.clearTimeout(capId)
      window.clearTimeout(waitId)
      window.removeEventListener("load", finish)
    }
  }, [])

  // scroll spy da tab bar mobile: ver MobileTabBar (estado isolado p/ não re-renderizar o App)

  // hero parallax
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroProgress, [0, 1], [0, 140])
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08])
  const heroRotate = useTransform(heroProgress, [0, 1], [0, 28])
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0])

  return (
    <div className="bg-paper text-ink selection:bg-ink selection:text-paper">
      {/* progress */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[2px] bg-ink origin-left z-[60]" />

      {/* loader */}
      <AnimatePresence>
        {!loaderDone && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed top-0 left-0 right-0 bottom-0 z-[70] bg-ink flex flex-col items-center justify-center"
          >
            <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <YinYang size={96} animate={true} />
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.10 }} className="mt-6 font-mono text-[11px] tracking-[0.28em] text-white/60 uppercase">
              Marcus Pereira — Portifólio
            </motion.p>
            <motion.div className="mt-8 h-px w-24 bg-white/15 overflow-hidden">
              <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} className="h-full w-full bg-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* nav — desktop: topo; mobile: só a tab bar inferior */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="md:mt-4 flex items-center justify-between rounded-full bg-white/80 border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-3 py-2.5 md:px-5" style={{ WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)' }}>
            <a href="#" className="flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-ink text-white">
                <YinYang size={22} animate={true} className="shrink-0" />
              </span>
              <span className="hidden sm:flex flex-col leading-none">
                <span className="font-display font-semibold text-[13px] tracking-tight">MARCUS PEREIRA</span>
                <span className="font-mono text-[10px] tracking-[0.14em] text-black/50">FULL STACK · 8+ ANOS</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {[
                ["Sobre", "#sobre"],
                ["Experiência", "#experiencia"],
                ["Stack", "#stack"],
                ["Projetos", "#projetos"],
              ].map(([label, href]) => (
                <a key={href} href={href} className="px-4 py-2 rounded-full text-[13px] font-medium text-black/60 hover:text-black hover:bg-black/[0.06] transition">
                  {label}
                </a>
              ))}
              <a href="#contato" className="ml-2 inline-flex items-center gap-2 bg-ink text-white rounded-full px-5 py-2.5 text-[13px] font-medium hover:bg-black transition">
                Contato <span aria-hidden>→</span>
              </a>
            </nav>

            <a href="#contato" className="md:hidden inline-flex items-center gap-1.5 bg-ink text-white rounded-full px-4 py-2.5 text-[13px] font-medium">
              Contato <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO — Yin Yang immersive (mobile sem header: sem compensação de topo) */}
      <section ref={heroRef} id="inicio" className="relative overflow-hidden bg-paper pt-8 md:pt-[110px]">
        {/* giant yin yang behind */}
        {/* NOTA: sem classes -translate-*: o motion escreve `transform` inline,
            que no Tailwind v3 anulava o translate da classe. No v4 o translate
            comporia com o transform e deslocaria o fundo — removido p/ manter o original. */}
        <motion.div
          style={{ y: heroY, scale: heroScale, rotate: heroRotate, opacity: heroOpacity }}
          className="pointer-events-none absolute select-none hidden md:block md:right-[-4vw] md:top-[8%] lg:right-[30vw] lg:top-[4%]"
        >
          <YinYangPlanet />
        </motion.div>

        {/* grain */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          {/* eyebrow */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-[0.16em] uppercase text-black/50">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Disponível para novos projetos
              </span>
              <span className="hidden sm:inline-flex items-center gap-2">
                <span className="w-px h-3 bg-black/10" /> Rio de Janeiro · Remoto
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5">
                <span className="w-px h-3 bg-black/10" /> Yin <span className="w-1.5 h-1.5 rounded-full bg-ink inline-block" /> Yang — Equilíbrio em código
              </span>
            </div>
          </Reveal>

          {/* huge display */}
          <div className="mt-6 md:mt-8">
            <Reveal delay={0.08}>
              <p className="font-serif italic text-[18px] md:text-[22px] leading-none text-black/60">Olá, eu sou</p>
            </Reveal>
            <h1 className="font-display font-[700] tracking-[-0.04em] leading-[0.86] text-[13vw] md:text-[98px] lg:text-[128px]">
              <Reveal delay={0.12}><span className="block">MARCUS</span></Reveal>
              <Reveal delay={0.16}>
                <span className="flex items-center gap-3 md:gap-5">
                  <span className="inline-grid place-items-center">
                    <motion.span
                      initial={{ rotate: -12, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                      className="inline-block"
                    >
                      <YinYang size={54} className="md:w-[72px] md:h-[72px] lg:w-[84px] lg:h-[84px]" animate={true} stroke />
                    </motion.span>
                  </span>
                  <span className="font-serif font-[400] italic tracking-[-0.03em]">Pereira</span>
                </span>
              </Reveal>
            </h1>

            <div className="mt-6 md:mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 md:gap-8 items-end">
              <Reveal delay={0.2}>
                <p className="text-[18px] md:text-[20px] leading-[1.45] text-balance max-w-[58ch] text-black/70">
                  <span className="text-ink font-medium">Desenvolvedor Full Stack</span> há 8+ anos. Transito entre <em className="font-serif italic">backend e frontend</em>, dados e automação, produto e operação — equilibrando estabilidade e evolução.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton href="#projetos" variant="dark">Ver projetos <span>↗</span></MagneticButton>
                  <MagneticButton href="mailto:marcusvfpereira@gmail.com" variant="ghost">marcusvfpereira@gmail.com</MagneticButton>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] tracking-wide">
                  {["Python", "Go", "TypeScript", "RPA", "Docker/K8s", "CI/CD", "AI Agents", "RAG"].map((t) => (
                    <span key={t} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-black/70">{t}</span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.26} className="lg:justify-self-end w-full">
                <div className="relative rounded-[28px] bg-ink text-paper p-6 md:p-7 overflow-hidden">
                  <div className="absolute -right-10 -top-10 opacity-[0.09]"><YinYang size={220} animate={true} /></div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/50">Filosofia — Yin Yang</p>
                  <p className="mt-3 font-display text-[22px] md:text-[24px] leading-[1.15] font-semibold text-balance">
                    Código que <span className="font-serif italic font-normal">respira</span> dos dois lados.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-[13px] leading-relaxed">
                    <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                      <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50">Yin — Estrutura</p>
                      <p className="mt-1 font-medium">APIs estáveis, filas, dados, observabilidade. 
                        <p className="mt-2 font-mono text-[8px] tracking-[0.16em] uppercase text-white/50">O que sustenta.</p>
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white text-ink p-4">
                      <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-black/50">Yang — Movimento</p>
                      <p className="mt-1 font-medium">Interfaces, automação, entrega.</p>
                      <p className="mt-2 font-mono text-[8px] tracking-[0.16em] uppercase text-black/50"> O que transforma.</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-[12px] text-white/60">
                    <span className="w-8 h-px bg-white/20" /> 8 anos em SDLC completo — do requisito ao on-call.
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* stats bar */}
          <Reveal delay={0.32}>
            <div className="mt-10 md:mt-12 grid grid-cols-3 divide-x divide-black/10 rounded-[20px] bg-white border border-black/[0.06] overflow-hidden">
              {[
                ["30+", "robôs", "em produção"],
                ["3", "empresas", "do estágio à sociedade"],
                ["1000+", "horas", "economizadas"],
              ].map(([n, l1, l2]) => (
                <div key={n} className="px-4 md:px-8 py-5 md:py-6 text-center md:text-left">
                  <div className="font-display font-bold text-[28px] md:text-[36px] leading-none tracking-tight">{n}</div>
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-black/45">{l1} · {l2}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* marquee */}
        <div className="mt-8 border-y border-black/10 bg-ink text-paper overflow-hidden">
          <div className="relative flex">
            <div
              className="yy-marquee flex shrink-0 items-center gap-6 py-3 font-mono text-[12px] tracking-[0.18em] uppercase whitespace-nowrap"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="flex items-center gap-6">
                  <span className="opacity-80">Clean Architecture · Hexagonal · Observabilidade · CI/CD · RPA · Python · RAG · AI Agents</span>
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-white text-black"><span className="scale-[0.55]"><YinYang size={20} animate={false} /></span></span>
                </span>
              ))}
            </div>
            <div
              className="yy-marquee flex shrink-0 items-center gap-6 py-3 font-mono text-[12px] tracking-[0.18em] uppercase whitespace-nowrap"
              aria-hidden
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={`2-${i}`} className="flex items-center gap-6">
                  <span className="opacity-80">Clean Architecture · Hexagonal · Observabilidade · CI/CD · RPA · Python · RAG · AI Agents</span>
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-white text-black"><span className="scale-[0.55]"><YinYang size={20} animate={false} /></span></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="sobre" className="relative bg-white border-t border-black/5">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-20">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-12 items-start">
            <div>
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/40">Manifesto</p>
                <h2 className="mt-3 font-display font-semibold tracking-[-0.03em] leading-[0.9] text-[36px] md:text-[52px]">
                  Equilíbrio <span className="font-serif italic font-normal">não é</span>
                  <br />meio-termo.
                  <br /><span className="inline-flex items-center gap-3">É tensão <span className="hidden sm:inline-grid place-items-center w-9 h-9 rounded-full bg-ink text-white"><YinYang size={22} animate={true} /></span> criativa.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="mt-8 rounded-[20px] border border-black/10 bg-paper p-5 md:p-6">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/40">O que eu faço bem</p>
                  <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-black/70">
                    <li className="flex gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink shrink-0" /> Levar requisito nebuloso até produção estável — com logs, métricas e runbooks.</li>
                    <li className="flex gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink shrink-0" /> Automação que tira trabalho repetitivo do humano sem criar um novo pesadelo operacional.</li>
                    <li className="flex gap-2.5"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink shrink-0" /> Código legível, testável e observável — porque manutenção é 80% da vida do software.</li>
                  </ul>
                </div>
              </Reveal>
            </div>

            <div className="space-y-6">
              <Reveal delay={0.06}>
                <p className="text-[17px] md:text-[18px] leading-[1.7] text-black/70 text-balance">
                  Sou desenvolvedor de software com mais de <strong className="text-black font-semibold">8 anos</strong> construindo e mantendo aplicações <strong className="text-black font-semibold">Web, APIs e soluções de automação (RPA)</strong>. Atuo de ponta a ponta no ciclo de desenvolvimento, desde o levantamento de requisitos e desenho de soluções até o deploy e o suporte em produção (on-call) — com foco em qualidade, estabilidade, observabilidade e evolução contínua dos sistemas.
                </p>
                <p className="mt-4 text-[15px] leading-[1.75] text-black/60">
                  Hoje sou sócio na <strong className="text-black">Aurea Robotics</strong>, onde atuo no desenvolvimento das soluções de automação e dos sistemas que dão suporte à operação. Desenvolvo os robôs e serviços backend, além de APIs, interfaces Web, dashboards e relatórios para acompanhamento das automações e seus resultados. Também sou responsável pela infraestrutura e pelos processos de entrega e operação dos serviços.
                </p>
              </Reveal> 

              <div className="grid sm:grid-cols-2 gap-4">
                <Reveal delay={0.1}>
                  <div className="rounded-[20px] bg-ink text-white p-6">
                    <div className="w-8 h-8 rounded-full bg-white text-black grid place-items-center"><span className="text-[14px]">◐</span></div>
                    <h3 className="mt-4 font-display font-semibold text-[15px]">Yin — O que sustenta</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">Arquitetura, modelagem de dados, contratos de API, filas, testes, monitoramento. Sem isso, nada escala.</p>
                  </div>
                </Reveal>
                <Reveal delay={0.16}>
                  <div className="rounded-[20px] bg-white border border-black/10 p-6">
                    <div className="w-8 h-8 rounded-full bg-ink text-white grid place-items-center"><span className="text-[14px]">◑</span></div>
                    <h3 className="mt-4 font-display font-semibold text-[15px]">Yang — O que move</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-black/60">Interfaces que explicam, automações que libertam, deploys que não dão susto. É aqui que o usuário sente.</p>
                  </div>
                </Reveal>
              </div>
              <ProcessSteps />

            </div>
          </div>

          {/* yin yang divider */}
          <Reveal>
            <div className="mt-10 md:mt-14 flex items-center gap-5" aria-hidden>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-black/20" />
              <span className="relative grid place-items-center">
                <span
                  className="yy-spin-slow absolute -inset-2 rounded-full border border-black/15"
                />
                <span className="grid place-items-center w-9 h-9 rounded-full border border-black/10 bg-black shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                  <YinYang size={22} animate={true} />
                </span>
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-black/10 to-black/20" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERIÊNCIA — timeline yin yang */}
      <section id="experiencia" className="bg-paper border-t border-black/5">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/40">Trajetória</p>
              <h2 className="mt-2 font-display font-semibold tracking-[-0.03em] leading-none text-[36px] md:text-[52px]">Experiência</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-[44ch] text-[14px] leading-relaxed text-black/55">Do estágio à sociedade — crescendo junto com os produtos e com as pessoas que os operam.</p>
            </Reveal>
          </div>

          <div className="mt-10 relative">
            {/* vertical line */}
            <div className="hidden md:block absolute left-[22px] top-2 bottom-2 w-px bg-black/10" />
            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <Reveal key={exp.company + exp.period} delay={i * 0.06}>
                  <div className="relative grid md:grid-cols-[48px_1fr] gap-4 md:gap-6">
                    <div className="hidden md:grid place-items-center w-[44px] h-[44px] rounded-full bg-ink text-white border-4 border-paper shadow-sm shrink-0">
                      <YinYang size={20} animate={false} />
                    </div>
                    <div className="rounded-[24px] bg-white border border-black/10 overflow-hidden">
                      <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-0">
                        <div className="p-6 md:p-7">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-ink text-white px-3 py-1 font-mono text-[11px] tracking-wide">{exp.period}</span>
                            <span className="rounded-full border border-black/10 px-3 py-1 font-mono text-[11px]">{exp.location}</span>
                          </div>
                          <h3 className="mt-4 font-display font-semibold text-[18px] md:text-[20px] leading-tight">{exp.role}</h3>
                          <p className="font-serif italic text-[15px] text-black/60">{exp.company}</p>
                          <ul className="mt-4 space-y-2 text-[13.5px] leading-relaxed text-black/65">
                            {exp.highlights.map((h) => (
                              <li key={h} className="flex gap-2.5"><span className="mt-[9px] w-1 h-1 rounded-full bg-black/40 shrink-0" /> <span>{h}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-ink text-white p-6 md:p-7 flex flex-col justify-between lg:border-l border-white/10">
                          <div>
                            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/50">Dualidade do período</p>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div className="rounded-2xl bg-white/[0.08] border border-white/10 p-4">
                                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">Yin</p>
                                <p className="mt-1 font-medium text-[13px] leading-tight">{exp.yin}</p>
                              </div>
                              <div className="rounded-2xl bg-white text-ink p-4">
                                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-black/50">Yang</p>
                                <p className="mt-1 font-medium text-[13px] leading-tight">{exp.yang}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex items-center gap-2 text-white/50 font-mono text-[11px]">
                            <YinYang size={16} animate={true} /> <span>— equilíbrio em produção</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* education */}
          <Reveal delay={0.18}>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {education.map((ed) => (
                <div key={ed.degree} className="rounded-[20px] bg-white border border-black/10 p-5 flex gap-4 items-start">
                  <span className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center shrink-0 text-[12px]">◐</span>
                  <div>
                    <p className="font-medium text-[13px] leading-tight">{ed.degree}</p>
                    <p className="text-[12px] text-black/55">{ed.school} · {ed.period}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-[20px] bg-ink text-white p-5 flex gap-4 items-start">
                <span className="w-9 h-9 rounded-full bg-white text-black grid place-items-center shrink-0">
                  <YinYang size={18} animate={false} />
                </span>
                <div className="w-full space-y-2">
                  <p className="font-medium text-[13px]">Idiomas</p>

                  <div className="space-y-1 text-[12px] text-white/90">
                    <div>
                      <span className="font-medium text-white">· Inglês:</span>
                      <p className="mt-0.5 pl-3 text-white/60">Avançado (Leitura e Escuta)</p>
                      <p className="mt-0.5 pl-3 text-white/60">Intermediário (Escrita e Conversação)</p>
                    </div>
                    <div>
                      <span className="font-medium text-white">· Espanhol:</span>
                      <span className="ml-1 text-white/60">Básico</span>
                    </div>
                  </div>
                </div>
              </div>
              


            </div>
          </Reveal>
        </div>
      </section>

      {/* STACK — bento yin yang */}
      <section id="stack" className="bg-ink text-paper relative overflow-hidden">
        <div className="absolute -right-32 -top-32 opacity-[0.06] hidden lg:block"><YinYang size={520} animate={true} /></div>
        <div className="absolute -left-32 -bottom-32 opacity-[0.04] hidden lg:block"><YinYang size={420} animate={true} /></div>
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-20 relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40">Stack & Ferramentas</p>
              <h2 className="mt-2 font-display font-semibold tracking-[-0.03em] leading-none text-[36px] md:text-[52px]">Cada lado <span className="font-serif italic font-normal text-white/80">potencializa</span> o outro.</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-[42ch] text-[13px] leading-relaxed text-white/55">Não é sobre saber tudo — é sobre conectar as peças certas sem fricção.</p>
            </Reveal>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stackGroups.map((g, i) => (
              <Reveal key={g.label} delay={i * 0.05}>
                <div className="group relative rounded-[24px] bg-white/[0.06] border border-white/10 p-6 hover:bg-white/[0.08] transition h-full overflow-hidden flex flex-col">
                  <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition"><YinYang size={28} animate={false} /></div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/50">{g.yin} · {g.label}</p>
                  </div>
                  <h3 className="mt-2 font-display font-semibold text-[16px]">{g.label}</h3>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <span key={it} className="rounded-full bg-white text-ink px-3 py-1.5 text-[12px] font-medium">{it}</span>
                    ))}
                  </div>

                  {/* Linha fixa no final do card  */}
                  <div className="mt-auto pt-5 ">
                    <div className="h-px bg-white/10" />
                  </div>

                  <div className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
                    <span className="w-6 h-px bg-white/20" />
                      Yin Yang — complementaridade
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          

          <Reveal delay={0.22}>
            <div className="mt-6 rounded-[24px] bg-white text-ink p-6 md:p-7 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-ink text-white grid place-items-center"><YinYang size={20} animate={true} /></span>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/50">Arquitetura</p>
                  <p className="font-display font-semibold text-[15px]">Clean · Hexagonal · Ports & Adapters</p>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-black/60">Regra da dependência respeitada, composition root explícita, providers/factories — código que envelhece bem.</p>
              <div className="flex flex-wrap gap-2">
                {["pytest", "TDD", "Git/GitHub/GitLab", "Azure", "OCI", "AWS/GCP — familiaridade"].map((t) => (
                  <span key={t} className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-medium bg-paper">{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROJETOS — yin yang cards */}
      <section id="projetos" className="bg-paper border-t border-black/5">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/40">Projetos selecionados</p>
              <h2 className="mt-2 font-display font-semibold tracking-[-0.03em] leading-none text-[36px] md:text-[52px]">
                Trabalho que <span className="font-serif italic font-normal">permanece.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-[44ch] text-[14px] leading-relaxed text-black/55">Quatro recortes do que construo no dia a dia — cada um equilibrando lados opostos.</p>
            </Reveal>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.07}>
                <article className={`group relative rounded-[28px] overflow-hidden border ${p.accent === "dark" ? "bg-ink text-white border-black" : "bg-white text-ink border-black/10"} p-6 md:p-7 h-full flex flex-col`}>
                  {/* yin yang watermark */}
                  <div className={`absolute -right-8 -top-8 ${p.accent === "dark" ? "opacity-[0.07] text-white" : "opacity-[0.06] text-black"}`}>
                    <YinYang size={160} animate={true} />
                  </div>

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className={`font-mono text-[11px] tracking-[0.16em] uppercase ${p.accent === "dark" ? "text-white/50" : "text-black/40"}`}>{p.category} · {p.year}</p>
                      <h3 className="mt-2 font-display font-semibold tracking-[-0.02em] text-[22px] md:text-[24px] leading-tight">{p.title}</h3>
                    </div>
                    <span className={`shrink-0 w-10 h-10 rounded-full grid place-items-center border ${p.accent === "dark" ? "bg-white text-black border-white" : "bg-black text-white border-black"} group-hover:rotate-45 transition duration-500`}>
                      ↗
                    </span>
                  </div>

                  <p className={`relative mt-3 text-[13.5px] leading-relaxed ${p.accent === "dark" ? "text-white/70" : "text-black/60"}`}>{p.description}</p>

                  <div className="relative mt-5 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span key={t} className={`rounded-full px-3 py-1.5 text-[11px] font-medium border ${p.accent === "dark" ? "bg-white/10 border-white/15 text-white" : "bg-ink text-white border-ink"}`}>{t}</span>
                    ))}
                  </div>

                  <div className={`relative mt-6 flex items-center gap-2 font-mono text-[11px] tracking-wide ${p.accent === "dark" ? "text-white/40" : "text-black/40"}`}>
                    <span className={`w-6 h-px ${p.accent === "dark" ? "bg-white/20" : "bg-black/15"}`} />
                    <span className="inline-flex items-center gap-1.5"><YinYang size={14} animate={false} /> yin — estrutura · yang — entrega</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.24}>
            <div className="mt-6 rounded-[24px] border border-dashed border-black/15 bg-white p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex gap-4 items-start">
                <span className="w-10 h-10 rounded-full bg-ink text-white grid place-items-center shrink-0"><YinYang size={20} animate={false} /></span>
                <div>
                  <p className="font-display font-semibold">Quer ver código, arquitetura ou bastidores?</p>
                  <p className="text-[13px] text-black/60">Posso compartilhar cases com diagramas, decisões e trade-offs</p>
                </div>
              </div>
              <a href="mailto:marcusvfpereira@gmail.com?subject=Portfólio%20—%20conversa%20sobre%20projeto" className="shrink-0 inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-3 text-[13px] font-medium hover:bg-black transition">
                Conversar sobre um case <span>→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTATO — split yin yang */}
      <section id="contato" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[520px]">
          {/* yang — light */}
          <div className="relative bg-paper px-6 md:px-10 lg:px-12 py-12 md:py-16 flex flex-col justify-center border-t lg:border-t-0 border-black/5">
            <div className="absolute right-6 top-6 opacity-[0.06] hidden md:block"><YinYang size={120} animate={true} /></div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/40">Contato — Yang · luz · ação</p>
              <h2 className="mt-3 font-display font-semibold tracking-[-0.03em] leading-[0.9] text-[36px] md:text-[46px]">
                Vamos <span className="font-serif italic font-normal">tirar</span>
                <br />do papel?
              </h2>
              <p className="mt-4 max-w-[44ch] text-[14px] leading-relaxed text-black/60">Aberto a freelas, parcerias e posições onde possa liderar tecnicamente e entregar de ponta a ponta — do requisito ao monitoramento.</p>
            </Reveal>

            <Reveal delay={0.08} className="mt-8 space-y-3">
              <a href="mailto:marcusvfpereira@gmail.com" className="flex items-center gap-4 rounded-2xl bg-white border border-black/10 p-4 hover:border-black/20 transition group">
                <span className="w-11 h-11 rounded-full bg-ink text-white grid place-items-center shrink-0">✉</span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] tracking-[0.14em] uppercase text-black/40">Email</span>
                  <span className="block font-medium text-[14px] truncate group-hover:underline">marcusvfpereira@gmail.com</span>
                </span>
                <span className="ml-auto opacity-40 group-hover:opacity-100 transition">↗</span>
              </a>
              <a href="https://wa.me/5521964644433?text=Olá!%20Gostaria%20de%20saber%20mais." target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-white border border-black/10 p-4 hover:border-black/20 transition group">
                <span className="w-11 h-11 rounded-full bg-white border border-black/10 grid place-items-center shrink-0">☎</span>
                <span>
                  <span className="block font-mono text-[11px] tracking-[0.14em] uppercase text-black/40">Telefone / WhatsApp</span>
                  <span className="block font-medium text-[14px] group-hover:underline">+55 (21) 96464-4433</span>
                </span>
                <span className="ml-auto opacity-40 group-hover:opacity-100 transition">↗</span>
              </a>
              <div className="flex gap-3">
                <a href="https://github.com/lblackoutl" target="_blank" rel="noreferrer" className="flex-1 rounded-2xl bg-white border border-black/10 p-4 text-center hover:border-black/20 transition">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black/40">GitHub</span>
                  <span className="block font-medium text-[13px]">Marcus Pereira ↗</span>
                </a>
                <a href="https://www.linkedin.com/in/marcus--pereira/" target="_blank" rel="noreferrer" className="flex-1 rounded-2xl bg-white border border-black/10 p-4 text-center hover:border-black/20 transition">
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-black/40">LinkedIn</span>
                  <span className="block font-medium text-[13px]">marcus--pereira ↗</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 font-mono text-[11px] text-black/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Rio de Janeiro · remoto · resposta em até 24h
              </p>
            </Reveal>
          </div>

          {/* yin — dark */}
          <div className="relative bg-ink text-white px-6 md:px-10 lg:px-12 py-12 md:py-16 flex flex-col justify-center overflow-hidden">
            <div className="absolute -right-16 -top-16 opacity-[0.08]"><YinYang size={360} animate={true} /></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
            <div className="relative">
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/40">Yin · sombra · profundidade</p>
                <h3 className="mt-3 font-display font-semibold tracking-[-0.02em] text-[28px] md:text-[34px] leading-tight">
                  Código sem <span className="font-serif italic font-normal text-white/80">fricção.</span>
                  <br />Produto sem drama.
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-white/60 max-w-[44ch]">Se seu time precisa de alguém que transita entre arquitetura e entrega, automação e cuidado com o detalhe — vamos conversar.</p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="mailto:marcusvfpereira@gmail.com?subject=Olá%20Marcus%20—%20vamos%20conversar" className="inline-flex items-center gap-2 rounded-full bg-white text-ink px-7 py-3.5 text-[14px] font-semibold hover:bg-paper transition">
                    Enviar email <span>→</span>
                  </a>
                  <a href="https://www.linkedin.com/in/marcus--pereira/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white px-7 py-3.5 text-[14px] font-medium hover:bg-white/10 transition">
                    LinkedIn
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="mt-8 rounded-2xl bg-white/[0.06] border border-white/10 p-5">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/40">O que acontece depois</p>
                  <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/75">
                    <li className="flex gap-2.5"><span className="font-mono text-white/30">01</span> Você me conta contexto, restrições e objetivo.</li>
                    <li className="flex gap-2.5"><span className="font-mono text-white/30">02</span> Eu volto com perguntas boas, um plano e uma estimativa honesta.</li>
                    <li className="flex gap-2.5"><span className="font-mono text-white/30">03</span> A gente equilibra até shippar.</li>
                  </ol>
                </div>
              </Reveal>

              <div className="mt-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] uppercase text-white/30">
                <span className="w-10 h-px bg-white/15" /> Marcus Pereira · 2026
              </div>
            </div>
          </div>
        </div>

        {/* center yin yang knot */}
        <div className="hidden lg:grid place-items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full bg-white border-[6px] border-ink shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <YinYang size={44} animate={true} />
        </div>
      </section>

      <footer className="bg-paper border-t border-black/5">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-black/65">
          <span className="inline-flex items-center gap-2 font-mono">
            <YinYang size={16} animate={false} /> © 2026 Marcus Vinicius Farias Pereira · Feito com equilíbrio.
          </span>
          <span className="font-mono text-[11px]">Rio de Janeiro, Brasil · marcusvfpereira@gmail.com</span>
        </div>
      </footer>

      {/* mobile tab bar — pílula flutuante: ícone sempre, nome só na aba ativa (salto direto via data-instant) */}
      <MobileTabBar />
      {/* respiro p/ a tab bar não cobrir o rodapé no mobile */}
      <div className="h-[76px] md:hidden" aria-hidden />
    </div>
  )
}
