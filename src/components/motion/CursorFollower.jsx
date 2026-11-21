'use client'
import { useEffect, useRef } from "react";

/**
 * Trailing ring + dot cursor accent (desktop mouse only).
 *
 * The native cursor stays visible — this is an accent, not a replacement, so
 * precision and accessibility are unchanged. The ring eases after the pointer
 * and grows over links/buttons. Disabled for touch and "reduce motion".
 */
const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary';

export default function CursorFollower() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !finePointer) return undefined;

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, visible = false;

    const show = (on) => {
      if (on === visible) return;
      visible = on;
      ring.style.opacity = on ? "1" : "0";
      dot.style.opacity = on ? "1" : "0";
    };
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      show(true);
      const hot = e.target.closest?.(INTERACTIVE);
      ring.classList.toggle("is-hover", Boolean(hot));
    };
    const onLeave = () => show(false);
    const onDown = () => ring.classList.add("is-press");
    const onUp = () => ring.classList.remove("is-press");
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
