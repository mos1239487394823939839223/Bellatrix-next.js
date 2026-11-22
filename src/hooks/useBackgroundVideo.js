'use client'
import { useEffect, useState } from "react";

/**
 * Decides whether a decorative background video should load.
 *
 * Returns false on the server and on first render, so the <video> is not in the
 * server HTML and doesn't start downloading before the page is interactive.
 * After mount it returns true unless the visitor asked for less data:
 *   - Data Saver / Save-Data, or a 2G-class connection
 *
 * The OS "reduce motion" setting is intentionally not a gate: these are slow,
 * muted, ambient loops (no flashing or parallax), and many phones have the
 * setting on, which left them with a still image instead of the hero video.
 *
 * Hero videos on this site are 3–20 MB, so this matters on phones.
 */
export function useBackgroundVideo() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const evaluate = () => {
      const saveData = Boolean(connection?.saveData);
      const slow = /(^|-)2g$/.test(connection?.effectiveType || "");
      setAllowed(!saveData && !slow);
    };

    evaluate();
    connection?.addEventListener?.("change", evaluate);
    return () => {
      connection?.removeEventListener?.("change", evaluate);
    };
  }, []);

  return allowed;
}

export default useBackgroundVideo;
