'use client'
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Shared building blocks for the admin dashboard. Colors come from the
// --adm-* tokens defined on .admin-layout in app/globals.css.

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const PageHeader = ({ title, description, actions, eyebrow }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && (
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--adm-text-subtle)]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--adm-text)]">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-[var(--adm-text-muted)]">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Panel = ({ children, className = "", as: Tag = "section", ...props }) => (
  <Tag
    className={cn(
      "rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface)] shadow-[var(--adm-shadow)]",
      className
    )}
    {...props}
  >
    {children}
  </Tag>
);

export const PanelHeader = ({ title, description, actions, className = "" }) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-3 border-b border-[var(--adm-border)] px-5 py-4",
      className
    )}
  >
    <div className="min-w-0">
      <h2 className="text-sm font-semibold text-[var(--adm-text)]">{title}</h2>
      {description && (
        <p className="mt-0.5 text-xs text-[var(--adm-text-muted)]">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

const BUTTON_VARIANTS = {
  primary:
    "bg-[var(--adm-accent)] text-white hover:bg-[var(--adm-accent-hover)] border border-transparent shadow-sm",
  secondary:
    "bg-[var(--adm-surface)] text-[var(--adm-text)] border border-[var(--adm-border-strong)] hover:bg-[var(--adm-surface-2)] shadow-sm",
  ghost:
    "bg-transparent text-[var(--adm-text-muted)] border border-transparent hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]",
  danger:
    "bg-[var(--adm-surface)] text-[var(--adm-danger)] border border-[var(--adm-border-strong)] hover:bg-[var(--adm-danger-soft)] hover:border-[color-mix(in_srgb,var(--adm-danger)_30%,transparent)]",
  dangerSolid: "bg-red-600 text-white border border-transparent hover:bg-red-700 shadow-sm",
};

const BUTTON_SIZES = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-10 px-4 text-sm gap-2",
};

export const Btn = React.forwardRef(
  (
    {
      variant = "secondary",
      size = "md",
      icon: Icon,
      loading = false,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        Icon && <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
      {children}
    </button>
  )
);
Btn.displayName = "Btn";

export const IconBtn = ({ icon: Icon, label, variant = "ghost", className = "", ...props }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={cn(
      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40",
      variant === "danger"
        ? "text-[var(--adm-text-muted)] hover:bg-[var(--adm-danger-soft)] hover:text-[var(--adm-danger)]"
        : "text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]",
      className
    )}
    {...props}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const BADGE_TONES = {
  neutral: "bg-[var(--adm-surface-2)] text-[var(--adm-text-muted)] border-[var(--adm-border)]",
  accent: "bg-[var(--adm-accent-soft)] text-[var(--adm-accent-text)] border-[color-mix(in_srgb,var(--adm-accent)_22%,transparent)]",
  success: "bg-[var(--adm-success-soft)] text-[var(--adm-success)] border-[color-mix(in_srgb,var(--adm-success)_22%,transparent)]",
  warning: "bg-[var(--adm-warning-soft)] text-[var(--adm-warning)] border-[color-mix(in_srgb,var(--adm-warning)_22%,transparent)]",
  danger: "bg-[var(--adm-danger-soft)] text-[var(--adm-danger)] border-[color-mix(in_srgb,var(--adm-danger)_22%,transparent)]",
};

export const Badge = ({ tone = "neutral", children, dot = false, className = "" }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
      BADGE_TONES[tone],
      className
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export const StatCard = ({ label, value, hint, icon: Icon, tone = "accent", onClick }) => {
  const iconTone = {
    accent: "text-[var(--adm-accent-text)] bg-[var(--adm-accent-soft)]",
    success: "text-[var(--adm-success)] bg-[var(--adm-success-soft)]",
    warning: "text-[var(--adm-warning)] bg-[var(--adm-warning-soft)]",
    neutral: "text-[var(--adm-text-muted)] bg-[var(--adm-surface-2)]",
  }[tone];
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-start justify-between gap-4 rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface)] p-5 text-left shadow-[var(--adm-shadow)]",
        onClick && "transition-colors hover:border-[var(--adm-border-strong)]"
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-[var(--adm-text-muted)]">{label}</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[var(--adm-text)]">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-[var(--adm-text-subtle)]">{hint}</p>}
      </div>
      {Icon && (
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconTone)}>
          <Icon className="h-5 w-5" />
        </span>
      )}
    </Tag>
  );
};

export const SearchInput = ({ value, onChange, placeholder = "Search…", className = "", ...props }) => (
  <div className={cn("relative", className)}>
    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--adm-text-subtle)]" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-lg border pl-9 pr-8 text-sm outline-none"
      {...props}
    />
    {value && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => onChange("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--adm-text-subtle)] hover:text-[var(--adm-text)]"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    )}
  </div>
);

export const Segmented = ({ options, value, onChange, className = "" }) => (
  <div
    role="tablist"
    className={cn(
      "inline-flex rounded-lg bg-[var(--adm-surface-2)] p-0.5",
      className
    )}
  >
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(opt.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            active
              ? "bg-[var(--adm-surface)] text-[var(--adm-text)] shadow-sm"
              : "text-[var(--adm-text-muted)] hover:text-[var(--adm-text)]"
          )}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span
              className={cn(
                "rounded px-1 tabular-nums",
                active ? "text-[var(--adm-text-muted)]" : "text-[var(--adm-text-subtle)]"
              )}
            >
              {opt.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export const Tabs = ({ tabs, value, onChange }) => (
  <div className="border-b border-[var(--adm-border)]">
    <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Tabs">
      {tabs.map((tab) => {
        const active = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-[var(--adm-accent)] text-[var(--adm-text)]"
                : "border-transparent text-[var(--adm-text-muted)] hover:text-[var(--adm-text)]"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.name}
          </button>
        );
      })}
    </nav>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    {Icon && (
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--adm-surface-2)] text-[var(--adm-text-subtle)]">
        <Icon className="h-6 w-6" />
      </span>
    )}
    <p className="text-sm font-medium text-[var(--adm-text)]">{title}</p>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-[var(--adm-text-muted)]">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const Spinner = ({ label }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-sm text-[var(--adm-text-muted)]">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--adm-border-strong)] border-t-[var(--adm-accent)]" />
    {label}
  </div>
);

export const ErrorBanner = ({ message, onRetry }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(248,113,113,0.25)] bg-[var(--adm-danger-soft)] px-4 py-3">
    <div className="flex items-center gap-2 text-sm text-[var(--adm-danger)]">
      <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
      {message}
    </div>
    {onRetry && (
      <Btn size="sm" variant="secondary" onClick={onRetry}>
        Try again
      </Btn>
    )}
  </div>
);

export const Field = ({ label, hint, children, htmlFor }) => (
  <div>
    {label && (
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[var(--adm-text)]">
        {label}
      </label>
    )}
    {children}
    {hint && <p className="mt-1 text-xs text-[var(--adm-text-subtle)]">{hint}</p>}
  </div>
);

export const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--adm-accent)]/40";

// Dialog rendered in a portal so it is never clipped by scroll containers.
export const Dialog = ({ open, onClose, title, description, children, footer, size = "md" }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;
  const width = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" }[size];

  return createPortal(
    <div className="adm-tokens fixed inset-0 z-[60] flex items-center justify-center p-4" data-dashboard="true">
      <div className="absolute inset-0 bg-[var(--adm-overlay)] backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-2xl border border-[var(--adm-border)] bg-[var(--adm-surface)] shadow-[var(--adm-shadow-lg)]",
          width
        )}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--adm-text)]">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-[var(--adm-text-muted)]">{description}</p>
            )}
          </div>
          <IconBtn icon={XMarkIcon} label="Close" onClick={onClose} />
        </div>
        {children && <div className="px-5 pt-4">{children}</div>}
        {footer && <div className="mt-5 flex justify-end gap-2 rounded-b-2xl border-t border-[var(--adm-border)] bg-[var(--adm-surface-2)] px-5 py-3.5">{footer}</div>}
        {!footer && <div className="pb-5" />}
      </div>
    </div>,
    document.body
  );
};

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  loading = false,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={title}
    description={description}
    size="sm"
    footer={
      <>
        <Btn variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Btn>
        <Btn variant="dangerSolid" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Btn>
      </>
    }
  />
);

// Clipboard with a fallback for non-secure (http) origins where
// navigator.clipboard is unavailable.
export async function copyText(text, successMessage = "Copied to clipboard") {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast.success(successMessage);
    return true;
  } catch {
    toast.error("Couldn't copy — select the text and copy manually");
    return false;
  }
}

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export const formatRelative = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
