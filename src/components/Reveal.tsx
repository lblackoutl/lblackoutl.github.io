import { useRef } from "react"
import { motion, useInView } from "motion/react"

// once=false (padrão): reversível — esmaece ao sair da tela e re-anima
// ao voltar (ex.: scroll up). once=true: anima uma única vez e permanece.
export function Reveal({ children, delay = 0, className = "", once = false }: { children: React.ReactNode; delay?: number; className?: string; once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ y: 28, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: inView ? delay : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
