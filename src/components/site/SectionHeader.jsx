/**
 * <SectionHeader> — section title, optional intro and accent bar, coloured for
 * the section's tone. Titles may contain simple CMS formatting
 * (e.g. <span class="text-blue-600">word</span>), rendered safely.
 *
 *   <SectionHeader title="HR Modules" description="…" tone="dark" />
 */
import { cn } from "./cn";
import { smartRender } from "../../utils/htmlSanitizer";

const COLORS = {
  light: { title: "text-[var(--color-primary-dark)]", text: "text-[var(--color-text-secondary)]" },
  dark: { title: "text-[var(--color-text-inverse)]", text: "text-[var(--color-white)]" },
};

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {"light"|"dark"} [props.tone="light"]
 * @param {boolean} [props.accent]   short brand bar under the header
 * @param {"center"|"left"} [props.align="center"]
 * @param {string} [props.titleClassName]        replaces the default size/weight/spacing
 * @param {string} [props.descriptionClassName]  replaces the default size/width
 */
export default function SectionHeader({
  title,
  description,
  tone = "light",
  accent = false,
  align = "center",
  as: Heading = "h2",
  id,
  className = "mb-10",
  titleClassName = "text-3xl font-bold mb-4",
  descriptionClassName = "text-lg max-w-2xl mx-auto",
  children,
}) {
  if (!title && !description && !children) return null;
  const c = COLORS[tone] || COLORS.light;
  const html = typeof title === "string" ? smartRender(title) : null;
  return (
    <header className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {title &&
        (html ? (
          <Heading id={id} className={cn(titleClassName, c.title)} dangerouslySetInnerHTML={html} />
        ) : (
          <Heading id={id} className={cn(titleClassName, c.title)}>
            {title}
          </Heading>
        ))}
      {description && <p className={cn(descriptionClassName, c.text)}>{description}</p>}
      {accent && <div aria-hidden="true" className="mx-auto w-16 h-1 bg-[var(--color-primary)] rounded-full" />}
      {children}
    </header>
  );
}
