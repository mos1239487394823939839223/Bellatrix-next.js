/**
 * <Section> — the outer shell every page section shares: background tone,
 * vertical rhythm, centred container, and the data-theme the navbar reads to
 * switch between light and dark text.
 *
 *   <Section tone="navy" width="lg">…</Section>
 */
import { cn } from "./cn";

const TONES = {
  light: { className: "bg-[var(--color-bg-primary)]", theme: "light", band: true },
  muted: { className: "bg-[var(--color-bg-secondary)]", theme: "light", band: true },
  navy: { className: "", style: { backgroundColor: "var(--color-brand-dark-navy)" }, theme: "dark" },
  // no background of its own — set it with className (light text colours, dark-theme band)
  plain: { className: "", theme: "light", band: true },
};

const WIDTHS = { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl", container: "container" };
const PADDING = { none: "", sm: "py-12", md: "py-16", lg: "py-20" };

/**
 * @param {object} props
 * @param {"light"|"muted"|"navy"|"plain"} [props.tone="muted"]
 * @param {"sm"|"md"|"lg"|"xl"|"container"} [props.width="lg"]   container max width
 * @param {"none"|"sm"|"md"|"lg"} [props.padding="lg"]
 * @param {React.ReactNode} [props.backdrop]  decorative layer behind the content (patterns, glows)
 * @param {boolean} [props.glow]   subtle brand gradient overlay (dark sections)
 * @param {boolean} [props.band=true] light tones: shown as a lifted band in the dark theme
 */
export default function Section({
  tone = "muted",
  width = "lg",
  padding = "lg",
  glow = false,
  band = true,
  backdrop,
  className,
  containerClassName = "px-4",
  style,
  children,
  ...rest
}) {
  const t = TONES[tone] || TONES.muted;
  const layered = glow || Boolean(backdrop);
  return (
    <section
      data-theme={t.theme}
      className={cn(PADDING[padding], t.className, t.band && band && "light-section", layered && "relative", className)}
      style={{ ...t.style, ...style }}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-dark)]/10 via-transparent to-[var(--color-primary)]/10 pointer-events-none"
        />
      )}
      {backdrop}
      <div className={cn(WIDTHS[width] || WIDTHS.lg, "mx-auto", layered && "relative z-10", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
