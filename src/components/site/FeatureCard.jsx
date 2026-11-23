/**
 * <FeatureCard> — a centred card with a title and short description, used for
 * modules, benefits, use cases… Titles get a fixed two-line slot so the
 * descriptions in a row start at the same height.
 *
 *   <FeatureCard variant="glass" title="Payroll" description="…" />
 *
 * Variants:
 *   glass    — translucent card for dark (navy) sections
 *   elevated — white card with a soft shadow, compact text (4-up grids)
 *   outline  — white card with a brand-tinted border, larger text
 */
import { cn } from "./cn";

const VARIANTS = {
  glass: {
    card:
      "bg-[var(--color-text-inverse)]/5 backdrop-blur-sm shadow-2xl p-8 border border-[var(--color-text-inverse)]/10 hover:border-[var(--color-primary)] hover:shadow-[var(--color-primary)]/20 hover:shadow-2xl transition-all duration-300 animate-fade-in-up",
    title: "text-xl text-[var(--color-text-inverse)]",
    text: "text-[var(--color-text-light)] text-base",
  },
  elevated: {
    card:
      "bg-[var(--color-bg-primary)] shadow-lg p-7 border border-[var(--color-border-primary)] transition-shadow duration-300 hover:shadow-xl",
    title: "text-lg text-[var(--color-primary-dark)]",
    text: "text-[var(--color-text-secondary)] text-sm",
  },
  outline: {
    card:
      "bg-[var(--color-bg-primary)] shadow-md p-8 border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 animate-fade-in-up",
    title: "text-xl lg:text-2xl text-[var(--color-primary-dark)]",
    text: "text-[var(--color-text-secondary)] text-base lg:text-lg",
  },
};

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {"glass"|"elevated"|"outline"} [props.variant="outline"]
 * @param {React.ReactNode} [props.icon]   shown above the title
 * @param {React.ReactNode} [props.children] extra content (lists, buttons) under the text
 */
export default function FeatureCard({
  title,
  description,
  variant = "outline",
  icon,
  className,
  style,
  ariaLabel,
  children,
}) {
  const v = VARIANTS[variant] || VARIANTS.outline;
  return (
    <article
      className={cn("rounded-2xl h-full flex flex-col items-center text-center", v.card, className)}
      style={style}
      aria-label={ariaLabel || title}
    >
      {icon && <div className="mb-4" aria-hidden="true">{icon}</div>}
      <h3 className={cn("font-bold leading-tight min-h-[2.5em] flex items-center justify-center mb-3", v.title)}>
        {title}
      </h3>
      {description && <p className={cn("leading-relaxed", v.text)}>{description}</p>}
      {children}
    </article>
  );
}
