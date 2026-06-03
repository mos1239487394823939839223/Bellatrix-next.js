"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface Certification {
  id: string;
  logoUrl: string;
  title: string;
}

interface CertificationSectionProps {
  sectionTitle?: string;
  certifications?: Certification[];
}

const isLikelyImageSrc = (src?: string): boolean => {
  if (!src || typeof src !== "string") return false;

  const value = src.trim().toLowerCase();
  if (!value) return false;
  if (value.startsWith("data:image")) return true;

  const hasAllowedBase =
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://");

  const hasImageLikePath =
    /\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)(\?.*)?(#.*)?$/.test(value) ||
    value.includes("/uploads/");

  return hasAllowedBase && hasImageLikePath;
};

const getSafeLogoSrc = (src?: string): string | null =>
  isLikelyImageSrc(src) ? src!.trim() : null;

const shouldBypassOptimization = (src: string): boolean =>
  src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/uploads/");

// Default certifications show text tiles — upload real logos via the admin panel.
const defaultCertifications: Certification[] = [
  { id: "cert-1", logoUrl: "", title: "ISO 9001 Certification" },
  { id: "cert-2", logoUrl: "", title: "ISO 27001 Certification" },
  { id: "cert-3", logoUrl: "", title: "SOC 2 Type II" },
  { id: "cert-4", logoUrl: "", title: "GDPR Compliant" },
];

const titleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function CertificationSection({
  sectionTitle = "Our Certifications",
  certifications = defaultCertifications,
}: CertificationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      const theme = root.getAttribute("data-theme");
      setIsDarkTheme(theme === "purple" || theme === "dark");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const marqueeItems = useMemo(() => {
    if (!certifications.length) {
      return [];
    }

    return [...certifications, ...certifications];
  }, [certifications]);

  const marqueeDuration = Math.max(certifications.length * 8, 32);

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 py-12"
      aria-labelledby="certifications-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.h2
          id="certifications-heading"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`text-3xl font-bold tracking-tight text-center mb-10 ${
            isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          {sectionTitle}
        </motion.h2>

        {/* Smooth passing line animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <motion.div
            className="flex w-max gap-6"
            animate={certifications.length > 1 ? { x: ["0%", "-50%"] } : { x: "0%" }}
            transition={
              certifications.length > 1
                ? {
                    duration: marqueeDuration,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                  }
                : { duration: 0 }
            }
          >
            {marqueeItems.map((cert, index) => {
              const safeLogoSrc = getSafeLogoSrc(cert.logoUrl);

              return (
                <motion.div
                  key={`${cert.id}-${index}`}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="
                    group relative flex-shrink-0
                    w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px]
                    aspect-video
                    bg-white
                    rounded-2xl
                    border border-zinc-100
                    shadow-sm hover:shadow-lg
                    overflow-hidden
                    transition-shadow duration-300
                  "
                >
                  {safeLogoSrc ? (
                    <Image
                      src={safeLogoSrc}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, (max-width: 1024px) 300px, 320px"
                      className="h-full w-full object-contain p-4 transition-transform duration-300"
                      loading="lazy"
                      unoptimized={shouldBypassOptimization(safeLogoSrc)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4">
                      <span className="text-center text-sm font-semibold text-zinc-600 leading-snug">
                        {cert.title}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
