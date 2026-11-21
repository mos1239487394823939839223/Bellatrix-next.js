import React, { useEffect, useId, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = ({ isOpen, onClose, icon, title, subtitle, children }) => {
  const panelRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;

    // Lock page scroll behind the dialog
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog: first form field if there is one, else the panel
    const focusFirst = () => {
      const target =
        panel?.querySelector("input:not([type=hidden]), select, textarea") ||
        panel?.querySelector(FOCUSABLE) ||
        panel;
      target?.focus({ preventScroll: true });
    };
    // Content may be lazy-loaded; wait a frame so it exists
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      // Keep Tab / Shift+Tab inside the dialog
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      // Return focus to whatever opened the dialog
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-[rgba(16,24,40,0.6)] flex items-center justify-center z-50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        tabIndex={-1}
        className="cf-panel w-full max-w-2xl relative overflow-hidden animate-fade-in-up rounded-lg flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        </div>

        {/* Header */}
        <div className="cf-header relative px-6 sm:px-8 pt-6 pb-5 flex-shrink-0">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 id={titleId} className="cf-title text-xl font-semibold leading-snug">
                {title}
              </h2>
              {subtitle && (
                <p id={subtitleId} className="cf-muted text-sm leading-relaxed mt-1 max-w-md">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cf-close transition-all duration-300 p-2.5 rounded-full flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
              aria-label="Close dialog"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content — scrolls when taller than the screen (short phones, landscape) */}
        <div className="relative px-6 sm:px-8 py-6 overflow-y-auto overscroll-contain custom-scrollbar" data-lenis-prevent>
          {children}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #22d3ee, #3b82f6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #67e8f9, #60a5fa);
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #22d3ee rgba(255, 255, 255, 0.05);
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.18s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
