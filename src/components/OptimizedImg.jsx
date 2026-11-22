'use client'
import { useState } from "react";

/**
 * Drop-in replacement for <img> in CMS-driven sections.
 *
 * Editors can put any image into any section, and many are uploaded at full
 * camera size (e.g. a 5,600px / 1 MB photo shown 258px wide on a phone). This
 * routes site and CMS-upload images through Next's image optimizer (AVIF/WebP,
 * resized to the screen) via srcSet, while keeping the plain <img> element so
 * every section's existing classes, sizing and handlers keep working.
 *
 * Left untouched: SVG/GIF (vector / animated), data: and blob: URLs, images
 * from other hosts, and anything that already passes its own srcSet.
 * If an optimized URL ever fails to load, it falls back to the original file.
 */
const SITE_ORIGIN = "https://bellatrixinc.com";
const OWN_HOST = /^https?:\/\/(www\.)?bellatrixinc\.com(?=\/)/i;
// Must be in next.config images.deviceSizes / imageSizes
const WIDTHS = [256, 384, 640, 828, 1080, 1200, 1920];

export function optimizableUrl(src) {
  if (typeof src !== "string" || !src) return null;
  const s = src.trim();
  if (/^(data|blob):/i.test(s) || s.startsWith("/_next/")) return null;
  if (/\.(svg|gif)(\?|#|$)/i.test(s)) return null;
  // Absolute URL so the optimizer can fetch it (remotePatterns allow this host,
  // including ?v= cache-busting query strings).
  if (s.startsWith("/") && !s.startsWith("//")) return SITE_ORIGIN + s;
  if (OWN_HOST.test(s)) return s.replace(OWN_HOST, SITE_ORIGIN);
  return null;
}

const optimized = (url, w, q = 75) => `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${q}`;

export default function OptimizedImg({
  src,
  srcSet,
  sizes = "(max-width: 768px) 100vw, 800px",
  onError,
  alt = "",
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const url = !srcSet && !failed ? optimizableUrl(src) : null;

  if (!url) {
    return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} alt={alt} onError={onError} {...rest} />;
  }

  return (
    <img
      src={optimized(url, 1080)}
      srcSet={WIDTHS.map((w) => `${optimized(url, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      // Retry with the original file; the section's own onError only runs if
      // that fails too.
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}

/**
 * Same optimization for CSS background images (full-width heroes): returns an
 * optimized URL for site / CMS-upload images, or the original src otherwise.
 */
export function optimizedBgUrl(src, width = 1920) {
  const url = optimizableUrl(src);
  return url ? optimized(url, width) : src;
}
