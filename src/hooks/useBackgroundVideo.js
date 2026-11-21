'use client'
import { useEffect, useState } from "react";

/**
 * Decides whether a decorative background video should load.
 *
 * Returns false on the server and on first render, so the <video> is not in the
 * server HTML and doesn't start downloading before the page is interactive.
 * After mount it returns true unless the visitor asked for less:
 *   - OS "reduce motion" setting
 *   - Data Saver / Save-Data, or a 2G-class connection
 *
 * Hero videos on this site are 3–20 MB, so this matters on phones.
 */
export function useBackgroundVideo() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const evaluate = () => {
      const saveData = Boolean(connection?.saveData);
      const slow = /(^|-)2g$/.test(connection?.effectiveType || "");
      setAllowed(!motion.matches && !saveData && !slow);
    };

    evaluate();
    motion.addEventListener("change", evaluate);
    connection?.addEventListener?.("change", evaluate);
    return () => {
      motion.removeEventListener("change", evaluate);
      connection?.removeEventListener?.("change", evaluate);
    };
  }, []);

  return allowed;
}

export default useBackgroundVideo;
