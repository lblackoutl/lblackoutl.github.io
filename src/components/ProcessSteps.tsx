import { Fragment } from "react"
import { motion, type Variants } from "motion/react"
import { StepBadge } from "./StepBadge"

// <ol> semântico, data-driven; um único separador por etapa que gira
// via CSS (vertical no mobile, horizontal no desktop).
// Stagger via motion: container dispara, itens entram em cascata.
const PROCESS_STEPS = ["Entender", "Desenhar", "Construir", "Operar", "Evoluir"]

const badgesContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const badgeItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function ProcessSteps() {
  return (
    <motion.ol
      aria-label="Processo de trabalho"
      variants={badgesContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-40px" }}
      className="flex w-full flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
    >
      {PROCESS_STEPS.map((step, i) => (
        <Fragment key={step}>
          {i > 0 && (
            <motion.li variants={badgeItem} aria-hidden="true" className="grid place-items-center select-none">
              <span className="block rotate-90 text-black/20 leading-none sm:rotate-0">→</span>
            </motion.li>
          )}
          <motion.li variants={badgeItem}>
            <StepBadge variant={i % 2 === 0 ? "solid" : "outline"}>{step}</StepBadge>
          </motion.li>
        </Fragment>
      ))}
    </motion.ol>
  )
}
