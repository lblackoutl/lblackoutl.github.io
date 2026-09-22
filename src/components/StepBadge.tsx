export function StepBadge({ children, variant = "solid" }: { children: React.ReactNode; variant?: "solid" | "outline" }) {
  return (
    <span
      className={`block rounded-full px-4 py-2 text-[12px] font-medium ${
        variant === "solid"
          ? "bg-ink text-white"
          : "border border-black/10 bg-white text-ink"
      }`}
    >
      {children}
    </span>
  )
}
