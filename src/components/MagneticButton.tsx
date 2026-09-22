import { motion, useMotionValue, useSpring } from "motion/react"

export function MagneticButton({ children, href, variant = "dark" }: { children: React.ReactNode; href?: string; variant?: "dark" | "ghost" }) {
  // motion values (sem setState): o mousemove escreve direto no motion value
  // e o spring roda fora do React — zero re-renders por pixel.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 280, damping: 18 })
  const y = useSpring(my, { stiffness: 280, damping: 18 })
  const handleMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width / 2) * 0.32)
    my.set((e.clientY - r.top - r.height / 2) * 0.32)
  }
  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }
  const base = "inline-flex items-center gap-2 rounded-full text-[13px] font-medium tracking-wide px-6 py-[13px] transition-colors"
  const styles = {
    dark: "bg-ink text-paper hover:bg-[#1a1a1a]",
    ghost: "border border-ink/15 text-ink hover:bg-ink hover:text-paper hover:border-ink",
  } as const
  const Comp: React.ElementType = href ? "a" : "button"
  return (
    <motion.div
      onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ x, y }}
      className="inline-block"
    >
      <Comp href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined} className={`${base} ${styles[variant]}`}>
        {children}
      </Comp>
    </motion.div>
  )
}
