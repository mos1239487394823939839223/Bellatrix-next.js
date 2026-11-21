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

const defaultCertifications: Certification[] = [
  {
    id: "cert-1",
    logoUrl: "/images/certifications/cert-1.png",
    title: "ISO 9001 Certification",
  },
  {
    id: "cert-2",
    logoUrl: "/images/certifications/cert-2.png",
    title: "ISO 27001 Certification",
  },
  {
    id: "cert-3",
    logoUrl: "/images/certifications/cert-3.png",
    title: "SOC 2 Type II",
  },
  {
    id: "cert-4",
    logoUrl: "/images/certifications/cert-4.png",
    title: "GDPR Compliant",
  },
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
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  // Read after mount: reading it during render made the server HTML (doubled
  // marquee) differ from the client's first render for reduced-motion visitors,
  // which caused a hydration error.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  // Scroll only when there are enough logos to loop and the user allows motion
  // Always a single scrolling row (never stacked), including for visitors with
  // "reduce motion" — for them it simply moves at a slower, calmer pace.
  const shouldScroll = certifications.length > 1;
  const marqueeItems = useMemo(() => {
    if (!certifications.length) {
      return [];
    }

    return shouldScroll ? [...certifications, ...certifications] : certifications;
  }, [certifications, shouldScroll]);

  const marqueeDuration = Math.max(certifications.length * 4, 16) * (prefersReducedMotion ? 1.8 : 1);

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
          className="text-3xl font-bold tracking-tight text-center text-zinc-900 dark:text-zinc-50 mb-10"
        >
          {sectionTitle}
        </motion.h2>

        {/* Smooth passing line animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={shouldScroll ? "overflow-hidden" : ""}
          // Fade the edges so logos glide in/out instead of being chopped at the border
          style={
            shouldScroll
              ? {
                  maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                }
              : undefined
          }
        >
          <motion.div
            // restart the loop when the pace changes (reduce-motion is read after mount)
            key={marqueeDuration}
            className={shouldScroll ? "flex w-max gap-6 py-2" : "flex flex-wrap justify-center gap-6 py-2"}
            animate={shouldScroll ? { x: ["0%", "-50%"] } : { x: "0%" }}
            transition={
              shouldScroll
                ? {
                    duration: marqueeDuration,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                  }
                : { duration: 0 }
            }
          >
            {marqueeItems.map((cert, index) => (
              <motion.div
                key={`${cert.id}-${index}`}
                // Second copy exists only to make the loop seamless
                aria-hidden={index >= certifications.length ? true : undefined}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="
                  media-plate group relative flex-shrink-0
                  w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px]
                  aspect-video
                  bg-white
                  rounded-2xl
                  border border-zinc-100 dark:border-zinc-800
                  shadow-sm hover:shadow-lg dark:shadow-zinc-950/40
                  overflow-hidden
                  transition-shadow duration-300
                "
              >
                <Image
                  src={cert.logoUrl}
                  alt={index >= certifications.length ? "" : cert.title}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, (max-width: 1024px) 300px, 320px"
                  // contain + padding: certification logos must never be cropped
                  className="object-contain p-5 sm:p-6 transition-transform duration-300"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
