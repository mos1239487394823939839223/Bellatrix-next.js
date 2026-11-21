'use client'
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll reveal: section headings, intro copy and cards ease in
 * (fade + rise + un-blur) as they enter the viewport, with a short stagger
 * across siblings in a grid.
 *
 * SEO/UX safety:
 * - Progressive enhancement only. Server HTML is fully visible; the hidden
 *   start state is applied by JS after hydration, so crawlers, no-JS visitors
 *   and slow devices always get the content.
 * - Never hides anything already on screen, the first (hero) section, or
 *   elements that already animate themselves (framer-motion inline styles,
 *   [data-no-reveal]).
 * - Reduce motion: does nothing.
 * - Reveal classes are removed when done so components keep their own hover
 *   transitions.
 */
const SELECTOR = [
  "main section:not(:first-of-type) h2",
  "main section:not(:first-of-type) h2 + p",
  "main section:not(:first-of-type) [class*='grid'] > *",
].join(",");

const ownMotion = (el) => {
  const style = el.getAttribute("style") || "";
  if (/opacity|transform/.test(style)) return true;
  return Boolean(el.closest("[data-no-reveal], [role=dialog], nav, footer"));
};

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!("IntersectionObserver" in window)) return undefined;

    let io;
    const timer = setTimeout(() => {
      const vh = window.innerHeight;
      const candidates = [...document.querySelectorAll(SELECTOR)].filter((el) => {
        if (el.dataset.revealDone || ownMotion(el)) return false;
        // skip cards in horizontal scrollers (e.g. the swipeable service row on
        // phones): a fast swipe could skip past them and leave them hidden
        const parent = el.parentElement;
        if (parent && parent.scrollWidth > parent.clientWidth + 4) return false;
        // skip anything already visible — never hide content the visitor is looking at
        const r = el.getBoundingClientRect();
        if (r.left >= window.innerWidth || r.right <= 0) return false;
        return r.top > vh * 0.92 && r.height > 0;
      });

      // stagger siblings that share a parent (cards in a grid)
      const groupIndex = new Map();
      for (const el of candidates) {
        const p = el.parentElement;
        const i = groupIndex.get(p) || 0;
        groupIndex.set(p, i + 1);
        el.style.setProperty("--reveal-delay", `${Math.min(i, 5) * 80}ms`);
        el.classList.add("reveal-init");
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target;
            io.unobserve(el);
            el.classList.add("is-revealed");
            const done = () => {
              el.classList.remove("reveal-init", "is-revealed");
              el.style.removeProperty("--reveal-delay");
              el.dataset.revealDone = "1";
            };
            el.addEventListener("transitionend", done, { once: true });
            setTimeout(done, 1600); // safety net
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );
      candidates.forEach((el) => io.observe(el));
    }, 120); // let dynamically loaded sections mount first

    return () => {
      clearTimeout(timer);
      io?.disconnect();
      // never leave anything hidden when navigating away
      document.querySelectorAll(".reveal-init").forEach((el) => el.classList.remove("reveal-init", "is-revealed"));
    };
  }, [pathname]);

  return null;
}
