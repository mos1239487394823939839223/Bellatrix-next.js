'use client'
import { useCallback, useEffect, useId, useRef, useState } from "react";
import OptimizedImg from "../OptimizedImg";
import CTAButton from "../CTAButton";
import { VideoSources } from "../../utils/videoSources";

/**
 * Solution Showcase — closing section for a solution page.
 *
 * CMS-driven (any page, any content):
 *   mode "video"   → a presentation / demo video in an app-window frame.
 *                    Nothing downloads until the visitor presses play.
 *                    Accepts uploaded files and YouTube / Vimeo links.
 *   mode "screens" → a product tour: numbered list of screens beside a large
 *                    framed screenshot; click to view full screen; swipe on phones.
 * Background "dark" (navy band) or "light".
 */

// ---------- helpers ----------

const embedUrl = (url) => {
  if (typeof url !== "string") return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&title=0&byline=0&portrait=0`;
  return null;
};

const youtubeThumb = (url) => {
  const yt = typeof url === "string" && url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i);
  return yt ? `https://i.ytimg.com/vi/${yt[1]}/maxresdefault.jpg` : null;
};

const fmtTime = (s) => {
  if (!Number.isFinite(s) || s <= 0) return null;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.round(s % 60)).padStart(2, "0")}`;
};

const pad = (n) => String(n).padStart(2, "0");

// ---------- pieces ----------

/** Neutral app-window frame around screens and video. */
function Frame({ label, dark, children }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ${
        dark ? "border-white/10 bg-[#0d1a3a]" : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`flex h-9 items-center gap-3 border-b px-4 ${
          dark ? "border-white/10 bg-white/[0.04]" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/20" : "bg-gray-300"}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/20" : "bg-gray-300"}`} />
          <span className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-white/20" : "bg-gray-300"}`} />
        </div>
        {label && (
          <span className={`truncate text-xs font-medium ${dark ? "text-white/55" : "text-gray-500"}`}>{label}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function PlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.2-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function Chevron({ dir = "right", className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
    </svg>
  );
}

// ---------- video mode ----------

function VideoShowcase({ video, dark, frameLabel }) {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const url = video.url;
  const embed = embedUrl(url);
  const poster = video.poster || youtubeThumb(url);

  return (
    <div className="mx-auto max-w-5xl">
      <Frame label={frameLabel} dark={dark}>
        <div className="relative aspect-video bg-black">
          {playing ? (
            embed ? (
              <iframe
                src={embed}
                title={video.title || frameLabel || "Solution video"}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                className="absolute inset-0 h-full w-full bg-black"
                controls
                autoPlay
                playsInline
                poster={poster || undefined}
              >
                <VideoSources src={url} />
              </video>
            )
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full cursor-pointer text-left focus-visible:outline-none"
              aria-label={`Play video${video.title ? `: ${video.title}` : ""}`}
            >
              {poster ? (
                <OptimizedImg
                  src={poster}
                  alt=""
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                // No poster set: show the video's own first frame (metadata only, ~tens of KB)
                !embed && (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    preload="metadata"
                    muted
                    playsInline
                    tabIndex={-1}
                    aria-hidden="true"
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  >
                    <source src={`${url}#t=0.5`} type="video/mp4" />
                  </video>
                )
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20 transition-colors duration-300 group-hover:from-black/45" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#001038] shadow-lg transition-transform duration-300 group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-white/60 md:h-20 md:w-20">
                  <PlayIcon className="ml-1 h-7 w-7 md:h-8 md:w-8" />
                </span>
                <span className="text-sm font-semibold text-white md:text-base">
                  {video.buttonLabel || "Watch the demo"}
                  {fmtTime(duration) && <span className="ml-2 font-normal text-white/75">{fmtTime(duration)}</span>}
                </span>
              </span>
            </button>
          )}
        </div>
      </Frame>
    </div>
  );
}

// ---------- screens mode ----------

function Lightbox({ screens, index, onClose, onIndex }) {
  const closeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const screen = screens[index];
  useEffect(() => setLoaded(false), [index]);
  const multi = screens.length > 1;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (multi && e.key === "ArrowRight") onIndex((index + 1) % screens.length);
      if (multi && e.key === "ArrowLeft") onIndex((index - 1 + screens.length) % screens.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, multi, onClose, onIndex, screens.length]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={screen.title || "Screen preview"}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex flex-col bg-[#020817]/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-white md:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="truncate text-sm font-medium text-white/80">
          {multi && <span className="mr-3 tabular-nums text-white/50">{pad(index + 1)} / {pad(screens.length)}</span>}
          {screen.title}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-20">
        {!loaded && (
          <span className="absolute h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden="true" />
        )}
        <OptimizedImg
          key={screen.image}
          src={screen.image}
          alt={screen.title || ""}
          sizes="100vw"
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        />
        {multi && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + screens.length) % screens.length); }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-6"
              aria-label="Previous screen"
            >
              <Chevron dir="left" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % screens.length); }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-6"
              aria-label="Next screen"
            >
              <Chevron className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {screen.caption && (
        <p className="mx-auto max-w-3xl px-6 pb-6 text-center text-sm text-white/70" onClick={(e) => e.stopPropagation()}>
          {screen.caption}
        </p>
      )}
    </div>
  );
}

function ScreensShowcase({ screens, dark, frameLabel }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  // Frame takes the shape of the first screenshot (an app's screens usually
  // share one size), so wide or tall captures aren't letterboxed.
  const [ratio, setRatio] = useState(16 / 10);
  const touch = useRef(null);
  const multi = screens.length > 1;
  const current = screens[Math.min(active, screens.length - 1)];

  const go = useCallback((i) => setActive((i + screens.length) % screens.length), [screens.length]);

  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null || !multi) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  };

  const muted = dark ? "text-white/65" : "text-gray-600";
  const strong = dark ? "text-white" : "text-gray-900";

  const stage = (
    <Frame label={current.title || frameLabel} dark={dark}>
      <div
        className={`relative ${dark ? "bg-[#0a1430]" : "bg-gray-100"}`}
        style={{ aspectRatio: ratio }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {screens.map((s, i) => (
          <button
            key={`${s.image}-${i}`}
            type="button"
            tabIndex={i === active ? 0 : -1}
            aria-hidden={i !== active}
            onClick={() => setZoom(i)}
            className={`group absolute inset-0 h-full w-full cursor-zoom-in transition-opacity duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label={`View ${s.title || `screen ${i + 1}`} full size`}
          >
            <OptimizedImg
              src={s.image}
              alt={s.title || ""}
              sizes="(max-width: 1024px) 100vw, 860px"
              loading="lazy"
              onLoad={i === 0 ? (e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                if (w && h) setRatio(Math.min(2.4, Math.max(1.2, w / h)));
              } : undefined}
              className="h-full w-full object-contain"
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </svg>
              Full screen
            </span>
          </button>
        ))}
      </div>
    </Frame>
  );

  return (
    <>
      {multi ? (
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Step list (desktop) */}
          <div className="hidden lg:col-span-4 lg:block" role="tablist" aria-orientation="vertical" aria-label="Screens">
            <ol className="space-y-1">
              {screens.map((s, i) => {
                const on = i === active;
                return (
                  <li key={`${s.title}-${i}`}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(i)}
                      className={`w-full rounded-lg border-l-2 px-5 py-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        on
                          ? dark ? "border-blue-400 bg-white/[0.06]" : "border-blue-600 bg-white shadow-sm"
                          : dark ? "border-transparent hover:bg-white/[0.03]" : "border-transparent hover:bg-white/70"
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className={`text-xs font-semibold tabular-nums ${on ? (dark ? "text-blue-300" : "text-blue-600") : muted}`}>
                          {pad(i + 1)}
                        </span>
                        <span className={`font-semibold ${on ? strong : muted}`}>{s.title || `Screen ${i + 1}`}</span>
                      </span>
                      {on && s.caption && (
                        <span className={`mt-2 block pl-7 text-sm leading-relaxed ${muted}`}>{s.caption}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-8">
            {stage}
            {/* Phone/tablet: caption + controls under the screen */}
            <div className="mt-5 flex items-start justify-between gap-4 lg:hidden">
              <div className="min-w-0">
                <p className={`font-semibold ${strong}`}>
                  <span className={`mr-2 text-xs tabular-nums ${muted}`}>{pad(active + 1)}/{pad(screens.length)}</span>
                  {current.title}
                </p>
                {current.caption && <p className={`mt-1 text-sm leading-relaxed ${muted}`}>{current.caption}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                {[["left", -1, "Previous screen"], ["right", 1, "Next screen"]].map(([d, step, label]) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => go(active + step)}
                    aria-label={label}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      dark ? "border-white/15 text-white hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <Chevron dir={d} className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          {stage}
          {current.caption && <p className={`mt-5 text-center text-sm leading-relaxed ${muted}`}>{current.caption}</p>}
        </div>
      )}

      {zoom != null && (
        <Lightbox screens={screens} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />
      )}
    </>
  );
}

// ---------- section ----------

export default function SolutionShowcase(props) {
  const d = props.data && typeof props.data === "object" ? { ...props, ...props.data } : props;

  const screens = (Array.isArray(d.screens) ? d.screens : [])
    .map((s) => (typeof s === "string" ? { image: s } : s || {}))
    .filter((s) => s.image);
  const video = d.video && typeof d.video === "object" ? d.video : { url: d.videoUrl, poster: d.videoPoster };

  // Mode from the CMS; fall back to whatever media is actually filled in
  let mode = d.mode === "video" || d.mode === "screens" ? d.mode : video.url ? "video" : "screens";
  if (mode === "video" && !video.url && screens.length) mode = "screens";
  if (mode === "screens" && !screens.length && video.url) mode = "video";
  const hasMedia = mode === "video" ? Boolean(video.url) : screens.length > 0;

  const dark = d.background !== "light";
  const title = d.title;
  const headingId = useId();

  // Empty section: editors see a hint in the admin; visitors see nothing.
  const inAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  if (!hasMedia && !inAdmin) return null;

  return (
    <section
      data-theme={dark ? "dark" : "light"}
      className={`relative py-20 md:py-28 ${dark ? "text-white" : "light-section text-gray-900"}`}
      style={{ backgroundColor: dark ? "var(--color-brand-dark-navy, #001038)" : "var(--color-bg-secondary, #f8fafc)" }}
      aria-labelledby={title ? headingId : undefined}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(d.eyebrow || title || d.description) && (
          <header className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
            {d.eyebrow && (
              <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.16em] ${dark ? "text-blue-300" : "text-blue-600"}`}>
                {d.eyebrow}
              </p>
            )}
            {title && (
              <h2 id={headingId} className={`text-3xl font-bold leading-tight md:text-4xl ${dark ? "text-white" : "text-gray-900"}`}>
                {title}
              </h2>
            )}
            {d.description && (
              <p className={`mt-4 text-base leading-relaxed md:text-lg ${dark ? "text-white/70" : "text-gray-600"}`}>{d.description}</p>
            )}
          </header>
        )}

        {hasMedia ? (
          mode === "video" ? (
            <VideoShowcase video={video} dark={dark} frameLabel={d.frameLabel} />
          ) : (
            <ScreensShowcase screens={screens} dark={dark} frameLabel={d.frameLabel} />
          )
        ) : (
          <div className={`mx-auto max-w-3xl rounded-xl border border-dashed p-10 text-center text-sm ${dark ? "border-white/20 text-white/60" : "border-gray-300 text-gray-500"}`}>
            Add a video or screens to this section in the page editor.
          </div>
        )}

        {d.ctaText && (
          <div className="mt-12 flex justify-center">
            <CTAButton
              variant="primary"
              size="lg"
              className="rounded-lg"
              modalConfig={{
                title: d.ctaModalTitle || title || "Talk to an expert",
                subtitle: d.ctaModalSubtitle || "Tell us about your business and we'll walk you through it.",
                icon: "",
              }}
            >
              {d.ctaText}
            </CTAButton>
          </div>
        )}
      </div>
    </section>
  );
}
