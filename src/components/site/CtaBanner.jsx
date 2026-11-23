/**
 * <CtaBanner> — closing call to action: title, supporting text and a button
 * that opens the contact form (CTAButton), inside a <Section>.
 *
 *   <CtaBanner title="Ready to start?" description="…" buttonText="Talk to an expert" />
 */
import CTAButton from "../CTAButton";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {string} [props.description]
 * @param {string} [props.buttonText="Talk to an expert"]
 * @param {{title?:string, subtitle?:string}} [props.modal]  contact form heading
 * @param {"light"|"muted"|"navy"} [props.tone="muted"]
 */
export default function CtaBanner({
  title,
  subtitle,
  description,
  buttonText = "Talk to an expert",
  modal = {},
  tone = "muted",
  className,
}) {
  const dark = tone === "navy";
  return (
    <Section tone={tone} width="sm" padding="md" className={className} containerClassName="px-4 text-center">
      <SectionHeader
        title={title}
        tone={dark ? "dark" : "light"}
        className="mb-8"
        titleClassName="text-3xl md:text-4xl font-bold mb-10"
        description={description}
        descriptionClassName="text-lg md:text-xl"
      >
        {subtitle && (
          <p className={`text-lg md:text-xl mb-6 leading-relaxed ${dark ? "text-white/85" : "text-[var(--color-primary-dark)]"}`}>
            {subtitle}
          </p>
        )}
      </SectionHeader>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CTAButton
          variant="primary"
          size="lg"
          className="shadow-lg"
          modalConfig={{ title: modal.title || title, subtitle: modal.subtitle || description || "", icon: "" }}
        >
          {buttonText}
        </CTAButton>
      </div>
    </Section>
  );
}
