import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

// ── Yin Yang SVG ──────────────────────────────────────────────
// NOTA: rotação via CSS (.yy-spin, 36s linear infinite) em vez de motion —
// visual idêntico, porém GPU-composite sem JS por frame (eram ~15 loops JS).
export function YinYang({ size, className = "", animate = true, stroke = false }: { size?: number; className?: string; animate?: boolean; stroke?: boolean }) {
  return (
    <svg
      {...(size ? { width: size, height: size } : {})} viewBox="0 0 200 200" className={`${className}${animate ? " yy-spin" : ""}`}
      style={{ overflow: "visible" }}
    >
      <circle cx="100" cy="100" r="98" fill="#FAFAF8" stroke={stroke ? "#0A0A0A" : "none"} strokeWidth={stroke ? 1.2 : 0} />
      <path d="M100 2 A98 98 0 0 1 100 198 A49 49 0 0 1 100 100 A49 49 0 0 0 100 2" fill="#0A0A0A" />
      <circle cx="100" cy="51" r="22" fill="#FAFAF8" />
      <circle cx="100" cy="51" r="7" fill="#0A0A0A" />
      <circle cx="100" cy="149" r="22" fill="#0A0A0A" />
      <circle cx="100" cy="149" r="7" fill="#FAFAF8" />
      {stroke && <circle cx="100" cy="100" r="98" fill="none" stroke="#0A0A0A" strokeWidth="1.2" />}
    </svg>
  )
}

// ── Yin Yang Planet — 3D CSS puro (sem libs) ──────────────────
// Planeta inclinado (rotateX) girando no próprio eixo + 2 anéis em
// planos diferentes orbitando. Tilt reativo ao mouse via springs.
export function YinYangPlanet() {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rx = useSpring(rawX, { stiffness: 60, damping: 18 })
  const ry = useSpring(rawY, { stiffness: 60, damping: 18 })

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      rawY.set(dx * 22)   // mouse → esquerda/direita inclina em Y
      rawX.set(-dy * 18)  // mouse → cima/baixo inclina em X
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [rawX, rawY])

  return (
    <div ref={ref} className="yy-scene relative w-[420px] h-[420px] lg:w-[620px] lg:h-[620px]" style={{ WebkitMaskImage: "radial-gradient(closest-side at 40% 50%, black 25%, transparent 100%)", maskImage: "radial-gradient(closest-side at 40% 50%, black 25%, transparent 100%)" }}>
      <motion.div className="yy-space absolute inset-0" style={{ rotateX: rx, rotateY: ry }}>
        {/* aura pulsante (fora do tilt 3D, fica no plano de fundo) */}
        <div className="yy-aura absolute inset-[-14%] rounded-full bg-[radial-gradient(closest-side,rgba(10,10,10,0.10),rgba(10,10,10,0.04)_48%,transparent_72%)] blur-2xl" />

        {/* planeta: disco yin-yang deitado (rotateX 62°), girando no eixo Z local */}
        <div className="yy-planet absolute inset-[12%]" aria-hidden>
          <div className="yy-planet-spin absolute inset-0">
            <YinYang className="w-full h-full block text-ink opacity-[0.05]" animate={false} stroke />
          </div>
          {/* sombra do lado yin (baixo) — volume fake */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_78%,rgba(10,10,10,0.06),transparent_55%)]" />
          {/* specular sutil do lado yang (cima) */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.18),transparent_45%)]" />
        </div>

        {/* anel 1 — no plano do planeta, porém largo, traço deslizante */}
        <svg viewBox="0 0 200 200" className="yy-planet absolute inset-0 w-full h-full text-ink">
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.18" strokeDasharray="40 260" strokeLinecap="round" className="yy-dash" />
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.10" strokeDasharray="1 7" />
        </svg>

        {/* anel 2 — inclinação inversa (cruza o planeta como Saturno) */}
        <div className="yy-ring2 absolute inset-[4%]">
          <svg viewBox="0 0 200 200" className="yy-ring2-spin absolute inset-0 w-full h-full text-ink">
            <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.16" strokeDasharray="60 300" strokeLinecap="round" />
            <circle cx="186" cy="100" r="1.8" fill="currentColor" opacity="0.32" />
            <circle cx="14" cy="100" r="1.8" fill="currentColor" opacity="0.32" />
          </svg>
        </div>

        {/* sombra projetada sob o planeta (no "chão" 3D) */}
        <div className="yy-ground-shadow absolute left-[18%] right-[18%] bottom-[6%] h-[10%] rounded-[50%] bg-black/[0.08] blur-xl" />
      </motion.div>
    </div>
  )
}
