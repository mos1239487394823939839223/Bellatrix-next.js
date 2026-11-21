'use client'
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertial smooth scrolling (Lenis) for the public site — desktop mouse/trackpad only.
 *
 * Off for touch devices (native momentum is better there) and for visitors with
 * "reduce motion". Pauses automatically whenever the page is scroll-locked
 * (contact modal, mobile menu set body overflow:hidden) so those stay usable.
 * Scrollable panels inside dialogs/menus opt out with data-lenis-prevent.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      // easeOutExpo — quick response, long soft settle
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 }, // in-page #links land below the fixed navbar
      autoRaf: true,
      prevent: (node) => Boolean(node.closest?.("[data-lenis-prevent], [role=dialog]")),
    });
    window.__lenis = lenis;

    // Follow body scroll-lock set by the modal / mobile menu
    const sync = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}
