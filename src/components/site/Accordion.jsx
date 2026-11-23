'use client'
/**
 * <Accordion> — accessible question/answer list (FAQs).
 * Buttons expose aria-expanded / aria-controls; answers are labelled regions
 * with ids unique per accordion, so several FAQs can share a page.
 *
 *   <Accordion items={[{ question, answer }]} variant="card" />
 *
 * Variants:
 *   card — each item in its own bordered card, "+ / −" marker
 *   line — divider between items, chevron marker
 */
import { useId, useState } from "react";
import { cn } from "./cn";

const VARIANTS = {
  card: {
    list: "space-y-4",
    item: "bg-[var(--color-bg-primary)] rounded-lg shadow-md border border-[var(--color-border-primary)] overflow-hidden",
    button: "w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary)]",
    question: "text-lg font-medium text-[var(--color-text-primary)]",
    answer: "px-6 pb-4",
    marker: (open) => <span className="ml-4 transform transition-transform duration-200" aria-hidden="true">{open ? "−" : "+"}</span>,
  },
  line: {
    list: "space-y-6",
    item: "border-b border-[var(--color-primary)]/20 pb-4",
    button: "w-full text-left flex justify-between items-center text-lg font-medium text-[var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded",
    question: "",
    answer: "mt-2 animate-fade-in-up",
    marker: (open) => (
      <span className={cn("ml-4 transition-transform", open && "rotate-180")} aria-hidden="true">
        ▼
      </span>
    ),
  },
};

/** Read question/answer from the shapes the CMS has used over time. */
const q = (item) => item.question || item.q || item.title || "";
const a = (item) => item.answer || item.a || item.content || "";

/**
 * @param {object} props
 * @param {Array<{question?:string, answer?:string, q?:string, a?:string}>} props.items
 * @param {"card"|"line"} [props.variant="card"]
 * @param {number|null} [props.defaultOpen=null]   index open on first render
 * @param {boolean} [props.multiple=false]          allow several open at once
 * @param {number|null} [props.openIndex]           controlled open index (with onToggle)
 * @param {(index:number|null) => void} [props.onToggle]
 */
export default function Accordion({
  items = [],
  variant = "card",
  defaultOpen = null,
  multiple = false,
  openIndex,
  onToggle,
  className,
}) {
  const uid = useId();
  const v = VARIANTS[variant] || VARIANTS.card;
  const [openSet, setOpenSet] = useState(() => new Set(defaultOpen == null ? [] : [defaultOpen]));
  const controlled = openIndex !== undefined;

  const isOpen = (i) => (controlled ? openIndex === i : openSet.has(i));
  const toggle = (i) => {
    if (controlled) return onToggle?.(openIndex === i ? null : i);
    setOpenSet((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={cn(v.list, className)}>
      {items.map((item, i) => {
        const open = isOpen(i);
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <article key={i} className={v.item} aria-label={`FAQ: ${q(item) || "Question"}`}>
            <button
              type="button"
              id={btnId}
              onClick={() => toggle(i)}
              className={v.button}
              aria-expanded={open}
              aria-controls={panelId}
            >
              <span className={v.question}>{q(item) || "Question"}</span>
              {v.marker(open)}
            </button>
            {open && (
              <div id={panelId} role="region" aria-labelledby={btnId} className={v.answer}>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{a(item)}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
