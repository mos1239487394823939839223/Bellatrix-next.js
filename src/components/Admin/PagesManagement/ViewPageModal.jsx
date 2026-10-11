import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconBtn } from "../ui";

const ViewPageModal = ({ isOpen, onClose, page }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !page || typeof document === "undefined") return null;

  return createPortal(
    <div className="adm-tokens fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-6" data-dashboard="true">
      <div className="absolute inset-0 bg-[var(--adm-overlay)]" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-[var(--adm-border-strong)] bg-[var(--adm-surface)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--adm-border)] px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--adm-text)]">{page.title || page.slug}</p>
            <p className="truncate font-mono text-xs text-[var(--adm-text-subtle)]">/{page.slug}</p>
          </div>
          <a
            href={`/${page.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--adm-border-strong)] px-3 text-xs font-medium text-[var(--adm-text)] hover:bg-[var(--adm-surface-2)]"
          >
            Open in new tab
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
          </a>
          <IconBtn icon={XMarkIcon} label="Close preview" onClick={onClose} />
        </div>
        <iframe title="Page preview" src={`/${page.slug}`} className="w-full flex-1 border-0 bg-white" />
      </div>
    </div>,
    document.body
  );
};

export default ViewPageModal;
