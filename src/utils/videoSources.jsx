// Background videos that have a 720p "-mobile" encode next to them in /public.
// Phones get the smaller file via <source media>; everything else (including
// arbitrary CMS uploads) falls back to the original single source.
const HAS_MOBILE_VARIANT = new Set([
  "/Videos/about-hero.mp4",
  "/Videos/hrVideo.mp4",
  "/Videos/HomeHeroSectionV.mp4",
  "/Videos/aesthetic.mp4",
  "/Videos/implementation/homepage_hero.mp4",
  "/trainingHeroSection.mp4",
  "/trainingHeroSectionTwo.mp4",
]);

export const MOBILE_VIDEO_MEDIA = "(max-width: 767px)";

/**
 * Still frame (JPEG) for a known video, or null. Shown while the video loads,
 * when autoplay is blocked (iOS Low Power Mode), and instead of the video for
 * visitors with "reduce motion" or Data Saver.
 */
export function getPosterSrc(src) {
  if (typeof src !== "string") return null;
  const path = src.replace(/^https?:\/\/(www\.)?bellatrixinc\.com/i, "").split(/[?#]/)[0];
  return HAS_MOBILE_VARIANT.has(path) ? path.replace(/\.mp4$/i, "-poster.jpg") : null;
}

/** Returns the 720p variant path for a known video, or null. */
export function getMobileVideoSrc(src) {
  if (typeof src !== "string") return null;
  // Accept absolute site URLs and cache-busting query strings
  const path = src.replace(/^https?:\/\/(www\.)?bellatrixinc\.com/i, "").split(/[?#]/)[0];
  return HAS_MOBILE_VARIANT.has(path) ? path.replace(/\.mp4$/i, "-mobile.mp4") : null;
}

/**
 * <source> list for a background video: phone variant first (with a media query),
 * then the full-size file.
 */
export function VideoSources({ src, type = "video/mp4" }) {
  if (!src) return null;
  const mobile = getMobileVideoSrc(src);
  return (
    <>
      {mobile && <source src={mobile} type={type} media={MOBILE_VIDEO_MEDIA} />}
      <source src={src} type={type} />
    </>
  );
}

export default VideoSources;
