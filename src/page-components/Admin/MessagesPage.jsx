'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  GlobeAltIcon,
  InboxIcon,
  InboxStackIcon,
  PhoneIcon,
  TagIcon,
  TrashIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  getContactMessages,
  markMessageAsReplied,
  markMessageAsUnreplied,
  deleteContactMessage,
} from "../../lib/contactMessagesAPI";
import {
  Badge,
  Btn,
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  IconBtn,
  PageHeader,
  Panel,
  SearchInput,
  Segmented,
  cn,
  copyText,
  formatDateTime,
  formatRelative,
  getInitials,
} from "../../components/Admin/ui";

// Enum values sent by src/components/ContactForm.jsx
const INDUSTRIES = {
  1: "Manufacturing",
  2: "Retail & E-commerce",
  3: "Healthcare",
  4: "Finance & Banking",
  5: "Technology",
  6: "Professional Services",
  7: "Non-Profit",
  8: "Other",
};
const COUNTRIES = {
  3898: "United States",
  3386: "Canada",
  3895: "United Kingdom",
  3194: "Australia",
  3413: "Germany",
  3406: "France",
  3890: "UAE",
  3760: "Saudi Arabia",
  3358: "Egypt",
  999: "Other",
};

const lookup = (map, value) => {
  if (value === null || value === undefined || value === "" || value === 0) return "";
  if (typeof value === "number" || /^\d+$/.test(String(value))) return map[Number(value)] || String(value);
  return String(value);
};

// Normalise the API shape once so the UI never has to guess field names.
const normalize = (m) => ({
  id: m.id,
  name: (m.fullName || m.name || "").trim() || "Unknown sender",
  email: m.email || "",
  phone: m.phoneNumber || m.phone || "",
  company: m.companyName || m.company || "",
  industry: m.industryName || lookup(INDUSTRIES, m.industry),
  country: m.countryName || lookup(COUNTRIES, m.country),
  subject: m.subject || "",
  body: m.message || "",
  date: m.submittedAt || m.createdAt || m.date || null,
  isReplied: Boolean(m.isReplied),
});

// Soft avatar colours, picked deterministically from the sender's name.
// Mixed with the surface/text tokens so they work in light and dark themes.
const AVATAR_TONES = [
  "bg-[color-mix(in_srgb,#2563eb_14%,var(--adm-surface))] text-[color-mix(in_srgb,#2563eb_75%,var(--adm-text))]",
  "bg-[color-mix(in_srgb,#059669_14%,var(--adm-surface))] text-[color-mix(in_srgb,#059669_75%,var(--adm-text))]",
  "bg-[color-mix(in_srgb,#d97706_14%,var(--adm-surface))] text-[color-mix(in_srgb,#d97706_75%,var(--adm-text))]",
  "bg-[color-mix(in_srgb,#db2777_14%,var(--adm-surface))] text-[color-mix(in_srgb,#db2777_75%,var(--adm-text))]",
  "bg-[color-mix(in_srgb,#7c3aed_14%,var(--adm-surface))] text-[color-mix(in_srgb,#7c3aed_75%,var(--adm-text))]",
  "bg-[color-mix(in_srgb,#0891b2_14%,var(--adm-surface))] text-[color-mix(in_srgb,#0891b2_75%,var(--adm-text))]",
];
const avatarTone = (seed = "") => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
};

const Avatar = ({ name, size = "md" }) => (
  <span
    className={cn(
      "flex shrink-0 items-center justify-center rounded-full font-semibold",
      size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs",
      avatarTone(name)
    )}
  >
    {getInitials(name)}
  </span>
);

const dayGroup = (value) => {
  if (!value) return "Undated";
  const d = new Date(value);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((start - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  if (diffDays < 31) return "This month";
  return "Older";
};

const buildDetailsText = (m) => {
  const header = [
    `From: ${m.name}${m.email ? ` <${m.email}>` : ""}`,
    m.phone && `Phone: ${m.phone}`,
    m.company && `Company: ${m.company}`,
    m.industry && `Industry: ${m.industry}`,
    m.country && `Country: ${m.country}`,
    `Received: ${formatDateTime(m.date)}`,
    m.subject && `Subject: ${m.subject}`,
  ].filter(Boolean);
  return [...header, "", m.body].join("\n");
};

const buildReplyHref = (m) => {
  const subject = `Re: ${m.subject || "Your message to Bellatrix"}`;
  const quoted = m.body
    .split("\n")
    .map((l) => `> ${l}`)
    .join("\n");
  const body = `Hi ${m.name.split(" ")[0]},\n\n\n\nOn ${formatDateTime(m.date)}, ${m.name} wrote:\n${quoted}`;
  return `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const exportCsv = (rows) => {
  const cols = ["Name", "Email", "Phone", "Company", "Industry", "Country", "Received", "Status", "Message"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((m) =>
    [m.name, m.email, m.phone, m.company, m.industry, m.country, m.date ? new Date(m.date).toISOString() : "", m.isReplied ? "Replied" : "Unread", m.body]
      .map(esc)
      .join(",")
  );
  const blob = new Blob(["﻿" + [cols.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const Kbd = ({ children }) => (
  <kbd className="rounded border border-[var(--adm-border-strong)] bg-[var(--adm-surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--adm-text-muted)] shadow-sm">
    {children}
  </kbd>
);

const DetailRow = ({ label, value, icon: Icon, href }) => (
  <div className="group flex items-start gap-3 py-2.5">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--adm-text-subtle)]" />
    <div className="min-w-0 flex-1">
      <dt className="text-xs text-[var(--adm-text-subtle)]">{label}</dt>
      <dd className="mt-0.5 select-text break-words text-sm text-[var(--adm-text)]">
        {value ? (
          href ? (
            <a href={href} className="hover:text-[var(--adm-accent-text)] hover:underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-[var(--adm-text-subtle)]">Not provided</span>
        )}
      </dd>
    </div>
    {value && (
      <IconBtn
        icon={ClipboardDocumentIcon}
        label={`Copy ${label.toLowerCase()}`}
        className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
        onClick={() => copyText(value, `${label} copied`)}
      />
    )}
  </div>
);

const ListSkeleton = () => (
  <div className="divide-y divide-[var(--adm-border)]">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex gap-3 px-4 py-4">
        <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--adm-surface-2)]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--adm-surface-2)]" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--adm-surface-2)]" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-[var(--adm-surface-2)]" />
        </div>
      </div>
    ))}
  </div>
);

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedId, setSelectedId] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null); // { ids: [] }
  const [mobileDetail, setMobileDetail] = useState(false);
  const listRef = useRef(null);
  const paneRef = useRef(null);

  const fetchMessages = useCallback(async ({ silent = false } = {}) => {
    silent ? setRefreshing(true) : setLoading(true);
    const res = await getContactMessages();
    if (res.success) {
      const raw = Array.isArray(res.data) ? res.data : res.data?.items || [];
      setMessages(raw.map(normalize));
      setError(null);
    } else {
      setError(res.message || "Failed to load messages");
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchMessages();
    // Deep link: /admin/messages?id=123 (used by the dashboard)
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setSelectedId(isNaN(Number(id)) ? id : Number(id));
      setMobileDetail(true);
    }
  }, [fetchMessages]);

  const counts = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return {
      all: messages.length,
      unread: messages.filter((m) => !m.isReplied).length,
      replied: messages.filter((m) => m.isReplied).length,
      week: messages.filter((m) => m.date && new Date(m.date).getTime() >= weekAgo).length,
    };
  }, [messages]);

  // Keep the sidebar badge in sync
  useEffect(() => {
    if (!loading) {
      window.dispatchEvent(new CustomEvent("admin:unread-count", { detail: counts.unread }));
    }
  }, [counts.unread, loading]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages
      .filter((m) => (status === "unread" ? !m.isReplied : status === "replied" ? m.isReplied : true))
      .filter(
        (m) =>
          !q ||
          [m.name, m.email, m.company, m.phone, m.subject, m.body, m.industry, m.country]
            .join(" ")
            .toLowerCase()
            .includes(q)
      )
      .sort((a, b) => {
        const diff = new Date(a.date || 0) - new Date(b.date || 0);
        return sortDir === "asc" ? diff : -diff;
      });
  }, [messages, search, status, sortDir]);

  const selected = messages.find((m) => m.id === selectedId) || null;
  const selectedIndex = visible.findIndex((m) => m.id === selectedId);

  const history = useMemo(
    () =>
      selected?.email
        ? messages
            .filter((m) => m.email.toLowerCase() === selected.email.toLowerCase() && m.id !== selected.id)
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        : [],
    [messages, selected]
  );

  // Select the first message on desktop once data arrives
  useEffect(() => {
    if (!loading && selectedId === null && visible.length > 0 && window.innerWidth >= 1024) {
      setSelectedId(visible[0].id);
    }
  }, [loading, visible, selectedId]);

  const select = useCallback((id) => {
    setSelectedId(id);
    setMobileDetail(true);
    paneRef.current?.scrollTo({ top: 0 });
    const url = new URL(window.location.href);
    url.searchParams.set("id", id);
    window.history.replaceState(null, "", url);
  }, []);

  const go = useCallback(
    (delta) => {
      const next = visible[selectedIndex + delta];
      if (next) {
        select(next.id);
        listRef.current?.querySelector(`[data-id="${next.id}"]`)?.scrollIntoView({ block: "nearest" });
      }
    },
    [visible, selectedIndex, select]
  );

  const setReplied = useCallback(async (ids, replied) => {
    setBusy(true);
    const results = await Promise.all(
      ids.map((id) => (replied ? markMessageAsReplied(id) : markMessageAsUnreplied(id)))
    );
    const okIds = ids.filter((_, i) => results[i].success);
    setMessages((prev) => prev.map((m) => (okIds.includes(m.id) ? { ...m, isReplied: replied } : m)));
    setBusy(false);
    if (okIds.length === ids.length) {
      toast.success(
        ids.length > 1
          ? `${ids.length} messages marked as ${replied ? "replied" : "unread"}`
          : `Marked as ${replied ? "replied" : "unread"}`
      );
    } else {
      toast.error(`Couldn't update ${ids.length - okIds.length} message(s)`);
    }
    setCheckedIds([]);
  }, []);

  const doDelete = async () => {
    const ids = confirm?.ids || [];
    setBusy(true);
    const results = await Promise.all(ids.map((id) => deleteContactMessage(id)));
    const okIds = ids.filter((_, i) => results[i].success);
    if (okIds.includes(selectedId)) {
      const remaining = visible.filter((m) => !okIds.includes(m.id));
      const fallback = remaining[Math.min(Math.max(selectedIndex, 0), remaining.length - 1)];
      setSelectedId(fallback ? fallback.id : null);
      if (!fallback) setMobileDetail(false);
    }
    setMessages((prev) => prev.filter((m) => !okIds.includes(m.id)));
    setCheckedIds((prev) => prev.filter((id) => !okIds.includes(id)));
    setBusy(false);
    setConfirm(null);
    if (okIds.length === ids.length) {
      toast.success(ids.length > 1 ? `${ids.length} messages deleted` : "Message deleted");
    } else {
      toast.error(`Couldn't delete ${ids.length - okIds.length} message(s)`);
    }
  };

  // Keyboard shortcuts: j/k or arrows to move, r reply, e toggle replied, c copy, # delete
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey || confirm) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "/") {
        e.preventDefault();
        document.getElementById("inbox-search")?.focus();
      } else if (selected && e.key === "r" && selected.email) {
        window.location.href = buildReplyHref(selected);
      } else if (selected && e.key === "e") {
        setReplied([selected.id], !selected.isReplied);
      } else if (selected && e.key === "c") {
        copyText(selected.body, "Message copied");
      } else if (selected && e.key === "#") {
        setConfirm({ ids: [selected.id] });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, selected, setReplied, confirm]);

  const toggleChecked = (id) =>
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const allVisibleChecked = visible.length > 0 && visible.every((m) => checkedIds.includes(m.id));
  const selecting = checkedIds.length > 0;

  const metrics = [
    { key: "all", label: "All messages", value: counts.all, icon: InboxStackIcon, filter: "all" },
    { key: "unread", label: "Awaiting reply", value: counts.unread, icon: EnvelopeIcon, filter: "unread", tone: "accent" },
    { key: "replied", label: "Replied", value: counts.replied, icon: CheckCircleIcon, filter: "replied", tone: "success" },
    { key: "week", label: "Last 7 days", value: counts.week, icon: CalendarDaysIcon },
  ];

  let lastGroup = null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        description="Messages submitted through the contact form on your website."
        actions={
          <>
            <Btn icon={ArrowDownTrayIcon} disabled={visible.length === 0} onClick={() => exportCsv(visible)}>
              Export CSV
            </Btn>
            <Btn icon={ArrowPathIcon} loading={refreshing} onClick={() => fetchMessages({ silent: true })}>
              Refresh
            </Btn>
          </>
        }
      />

      {/* Metrics double as quick filters */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => {
          const active = m.filter && status === m.filter;
          const Icon = m.icon;
          const Tag = m.filter ? "button" : "div";
          return (
            <Tag
              key={m.key}
              type={m.filter ? "button" : undefined}
              onClick={m.filter ? () => setStatus(m.filter) : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-[var(--adm-surface)] px-4 py-3 text-left shadow-[var(--adm-shadow)] transition-colors",
                active
                  ? "border-[var(--adm-accent)] ring-1 ring-[var(--adm-accent)]"
                  : "border-[var(--adm-border)]",
                m.filter && !active && "hover:border-[var(--adm-border-strong)]"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  m.tone === "accent"
                    ? "bg-[var(--adm-accent-soft)] text-[var(--adm-accent-text)]"
                    : m.tone === "success"
                      ? "bg-[var(--adm-success-soft)] text-[var(--adm-success)]"
                      : "bg-[var(--adm-surface-2)] text-[var(--adm-text-muted)]"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-xl font-semibold tabular-nums leading-tight text-[var(--adm-text)]">
                  {loading ? "–" : m.value}
                </span>
                <span className="block truncate text-xs text-[var(--adm-text-muted)]">{m.label}</span>
              </span>
            </Tag>
          );
        })}
      </div>

      {error && <ErrorBanner message={error} onRetry={() => fetchMessages()} />}

      <Panel className="grid overflow-hidden lg:h-[calc(100vh-15rem)] lg:min-h-[600px] lg:grid-cols-[minmax(320px,380px)_1fr]">
        {/* ───────── List column ───────── */}
        <div
          className={cn(
            "flex min-h-0 flex-col border-[var(--adm-border)] bg-[var(--adm-surface)] lg:border-r",
            mobileDetail && "hidden lg:flex"
          )}
        >
          <div className="space-y-3 border-b border-[var(--adm-border)] p-3">
            <SearchInput id="inbox-search" value={search} onChange={setSearch} placeholder="Search messages…  ( / )" />
            <div className="flex items-center justify-between gap-2">
              <Segmented
                value={status}
                onChange={setStatus}
                options={[
                  { value: "all", label: "All" },
                  { value: "unread", label: "Unread", count: counts.unread },
                  { value: "replied", label: "Replied" },
                ]}
              />
              <button
                type="button"
                onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]"
              >
                {sortDir === "desc" ? "Newest first" : "Oldest first"}
                {sortDir === "desc" ? <ChevronDownIcon className="h-3.5 w-3.5" /> : <ChevronUpIcon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Selection bar */}
          {selecting && (
            <div className="flex h-11 items-center gap-1 border-b border-[var(--adm-border)] bg-[var(--adm-accent-soft)] px-3 text-xs">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={allVisibleChecked}
                onChange={() => setCheckedIds(allVisibleChecked ? [] : visible.map((m) => m.id))}
                className="mr-1 h-4 w-4 rounded"
              />
              <span className="mr-auto font-medium text-[var(--adm-accent-text)]">{checkedIds.length} selected</span>
              <Btn size="sm" variant="ghost" icon={CheckCircleIcon} disabled={busy} onClick={() => setReplied(checkedIds, true)}>
                Replied
              </Btn>
              <Btn size="sm" variant="ghost" icon={EnvelopeIcon} disabled={busy} onClick={() => setReplied(checkedIds, false)}>
                Unread
              </Btn>
              <IconBtn icon={TrashIcon} label="Delete selected" variant="danger" disabled={busy} onClick={() => setConfirm({ ids: checkedIds })} />
            </div>
          )}

          <ul ref={listRef} className="adm-scroll min-h-0 flex-1 overflow-y-auto max-lg:max-h-[70vh]">
            {loading ? (
              <li><ListSkeleton /></li>
            ) : visible.length === 0 ? (
              <li>
                <EmptyState
                  icon={InboxIcon}
                  title={search || status !== "all" ? "No matching messages" : "No messages yet"}
                  description={
                    search || status !== "all"
                      ? "Try a different search or filter."
                      : "Submissions from the website contact form will appear here."
                  }
                  action={
                    (search || status !== "all") && (
                      <Btn size="sm" onClick={() => { setSearch(""); setStatus("all"); }}>
                        Clear filters
                      </Btn>
                    )
                  }
                />
              </li>
            ) : (
              visible.map((m) => {
                const active = m.id === selectedId;
                const checked = checkedIds.includes(m.id);
                const group = dayGroup(m.date);
                const showGroup = group !== lastGroup;
                lastGroup = group;
                return (
                  <React.Fragment key={m.id}>
                    {showGroup && (
                      <li className="sticky top-0 z-10 border-b border-[var(--adm-border)] bg-[var(--adm-surface-2)]/95 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--adm-text-subtle)] backdrop-blur">
                        {group}
                      </li>
                    )}
                    <li
                      data-id={m.id}
                      className={cn(
                        "group relative flex cursor-pointer gap-3 border-b border-[var(--adm-border)] px-4 py-3.5 transition-colors",
                        active ? "bg-[var(--adm-accent-soft)]" : checked ? "bg-[var(--adm-surface-2)]" : "hover:bg-[var(--adm-surface-2)]"
                      )}
                      onClick={() => select(m.id)}
                    >
                      {active && <span className="absolute inset-y-0 left-0 w-[3px] rounded-r bg-[var(--adm-accent)]" />}

                      {/* Avatar doubles as a checkbox on hover / while selecting */}
                      <span className="relative h-9 w-9 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className={cn(selecting || checked ? "hidden" : "group-hover:hidden")}>
                          <Avatar name={m.name} />
                        </span>
                        <label
                          className={cn(
                            "absolute inset-0 items-center justify-center rounded-full",
                            selecting || checked ? "flex" : "hidden group-hover:flex"
                          )}
                        >
                          <input
                            type="checkbox"
                            aria-label={`Select message from ${m.name}`}
                            checked={checked}
                            onChange={() => toggleChecked(m.id)}
                            className="h-4 w-4 rounded"
                          />
                        </label>
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p
                            className={cn(
                              "truncate text-sm",
                              m.isReplied ? "font-medium text-[var(--adm-text-muted)]" : "font-semibold text-[var(--adm-text)]"
                            )}
                          >
                            {m.name}
                          </p>
                          <span className="flex shrink-0 items-center gap-1.5">
                            {!m.isReplied && <span className="h-2 w-2 rounded-full bg-[var(--adm-accent)]" aria-label="Unread" />}
                            <time
                              className={cn(
                                "text-xs tabular-nums",
                                m.isReplied ? "text-[var(--adm-text-subtle)]" : "font-medium text-[var(--adm-accent-text)]"
                              )}
                              dateTime={m.date || undefined}
                            >
                              {formatRelative(m.date)}
                            </time>
                          </span>
                        </div>
                        {(m.company || m.subject) && (
                          <p className={cn("mt-0.5 truncate text-[13px]", m.isReplied ? "text-[var(--adm-text-muted)]" : "text-[var(--adm-text)]")}>
                            {m.subject || m.company}
                          </p>
                        )}
                        <p className="mt-0.5 line-clamp-2 text-[13px] leading-5 text-[var(--adm-text-subtle)]">
                          {m.body || "No message content"}
                        </p>
                      </div>

                      {/* Hover quick actions (desktop) */}
                      <div
                        className="absolute right-3 top-2.5 hidden items-center gap-0.5 rounded-lg border border-[var(--adm-border)] bg-[var(--adm-surface)] p-0.5 shadow-[var(--adm-shadow-lg)] lg:group-hover:flex"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconBtn
                          icon={m.isReplied ? EnvelopeIcon : CheckIcon}
                          label={m.isReplied ? "Mark unread" : "Mark replied"}
                          className="h-7 w-7"
                          disabled={busy}
                          onClick={() => setReplied([m.id], !m.isReplied)}
                        />
                        <IconBtn icon={TrashIcon} label="Delete" variant="danger" className="h-7 w-7" onClick={() => setConfirm({ ids: [m.id] })} />
                      </div>
                    </li>
                  </React.Fragment>
                );
              })
            )}
          </ul>

          {!loading && visible.length > 0 && (
            <div className="border-t border-[var(--adm-border)] px-4 py-2 text-xs text-[var(--adm-text-subtle)]">
              {visible.length} of {counts.all} {counts.all === 1 ? "message" : "messages"}
            </div>
          )}
        </div>

        {/* ───────── Reading pane ───────── */}
        <div className={cn("flex min-h-0 flex-col bg-[var(--adm-bg)]", !mobileDetail && "hidden lg:flex")}>
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={EnvelopeOpenIcon}
                title={loading ? "Loading…" : "No message selected"}
                description="Pick a message from the list to read it in full, copy it, or reply."
              />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--adm-border)] bg-[var(--adm-surface)] px-3 py-2.5 sm:px-4">
                <Btn size="sm" variant="ghost" icon={ChevronLeftIcon} className="lg:hidden" onClick={() => setMobileDetail(false)}>
                  Inbox
                </Btn>
                <div className="flex items-center gap-0.5">
                  <IconBtn icon={ChevronUpIcon} label="Previous (k)" disabled={selectedIndex <= 0} onClick={() => go(-1)} />
                  <IconBtn
                    icon={ChevronDownIcon}
                    label="Next (j)"
                    disabled={selectedIndex === -1 || selectedIndex >= visible.length - 1}
                    onClick={() => go(1)}
                  />
                  {selectedIndex >= 0 && (
                    <span className="hidden px-1.5 text-xs tabular-nums text-[var(--adm-text-subtle)] sm:inline">
                      {selectedIndex + 1} of {visible.length}
                    </span>
                  )}
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  {selected.email && (
                    <a
                      href={buildReplyHref(selected)}
                      title="Reply (r)"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--adm-accent)] px-3 text-xs font-medium text-white shadow-sm hover:bg-[var(--adm-accent-hover)]"
                    >
                      <ArrowUturnLeftIcon className="h-3.5 w-3.5" />
                      Reply
                    </a>
                  )}
                  <Btn
                    size="sm"
                    icon={selected.isReplied ? EnvelopeIcon : CheckCircleIcon}
                    disabled={busy}
                    onClick={() => setReplied([selected.id], !selected.isReplied)}
                    title="Toggle replied (e)"
                  >
                    {selected.isReplied ? "Mark unread" : "Mark replied"}
                  </Btn>
                  <IconBtn icon={TrashIcon} label="Delete (#)" variant="danger" onClick={() => setConfirm({ ids: [selected.id] })} />
                </div>
              </div>

              <div ref={paneRef} className="adm-scroll min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-6 2xl:grid-cols-[minmax(0,1fr)_300px]">
                  {/* Message */}
                  <article className="min-w-0 space-y-4">
                    <div className="rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface)] shadow-[var(--adm-shadow)]">
                      <header className="flex flex-wrap items-start gap-4 border-b border-[var(--adm-border)] p-5">
                        <Avatar name={selected.name} size="lg" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="select-text text-lg font-semibold text-[var(--adm-text)]">{selected.name}</h2>
                            {selected.isReplied ? (
                              <Badge tone="success" dot>Replied</Badge>
                            ) : (
                              <Badge tone="accent" dot>Awaiting reply</Badge>
                            )}
                          </div>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-[var(--adm-text-muted)]">
                            {selected.email && (
                              <a href={`mailto:${selected.email}`} className="break-all hover:text-[var(--adm-accent-text)] hover:underline">
                                {selected.email}
                              </a>
                            )}
                            {selected.company && (
                              <>
                                <span className="text-[var(--adm-border-strong)]">•</span>
                                <span>{selected.company}</span>
                              </>
                            )}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--adm-text-subtle)]">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {formatDateTime(selected.date)} · {formatRelative(selected.date)}
                          </p>
                        </div>
                      </header>

                      <div className="p-5 sm:p-6">
                        {selected.subject && (
                          <h3 className="mb-3 select-text text-base font-semibold text-[var(--adm-text)]">{selected.subject}</h3>
                        )}
                        {/* Full message — selectable, line breaks preserved */}
                        <p className="select-text whitespace-pre-wrap break-words text-[15px] leading-7 text-[var(--adm-text)]">
                          {selected.body || <span className="italic text-[var(--adm-text-subtle)]">No message content</span>}
                        </p>
                      </div>

                      <footer className="flex flex-wrap items-center gap-2 rounded-b-xl border-t border-[var(--adm-border)] bg-[var(--adm-surface-2)]/60 px-5 py-3">
                        <Btn size="sm" icon={ClipboardDocumentIcon} onClick={() => copyText(selected.body, "Message copied")}>
                          Copy message
                        </Btn>
                        <Btn size="sm" icon={ClipboardDocumentListIcon} onClick={() => copyText(buildDetailsText(selected), "Message and details copied")}>
                          Copy with details
                        </Btn>
                        {selected.email && (
                          <Btn size="sm" variant="ghost" icon={EnvelopeIcon} onClick={() => copyText(selected.email, "Email copied")}>
                            Copy email
                          </Btn>
                        )}
                        <span className="ml-auto hidden items-center gap-1 text-[11px] text-[var(--adm-text-subtle)] xl:flex">
                          <Kbd>j</Kbd><Kbd>k</Kbd> navigate · <Kbd>r</Kbd> reply · <Kbd>e</Kbd> replied · <Kbd>c</Kbd> copy
                        </span>
                      </footer>
                    </div>
                  </article>

                  {/* Contact sidebar */}
                  <aside className="space-y-4">
                    <div className="rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-[var(--adm-shadow)]">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--adm-text-subtle)]">Contact</h4>
                      <dl className="mt-1 divide-y divide-[var(--adm-border)]">
                        <DetailRow label="Email" value={selected.email} icon={EnvelopeIcon} href={selected.email && `mailto:${selected.email}`} />
                        <DetailRow label="Phone" value={selected.phone} icon={PhoneIcon} href={selected.phone && `tel:${selected.phone.replace(/\s+/g, "")}`} />
                        <DetailRow label="Company" value={selected.company} icon={BuildingOffice2Icon} />
                        <DetailRow label="Industry" value={selected.industry} icon={TagIcon} />
                        <DetailRow label="Country" value={selected.country} icon={GlobeAltIcon} />
                      </dl>
                    </div>

                    <div className="rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface)] p-4 shadow-[var(--adm-shadow)]">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--adm-text-subtle)]">
                        Other messages from this sender
                      </h4>
                      {history.length === 0 ? (
                        <p className="mt-2 text-sm text-[var(--adm-text-muted)]">This is their only message.</p>
                      ) : (
                        <ul className="mt-2 space-y-1">
                          {history.slice(0, 5).map((h) => (
                            <li key={h.id}>
                              <button
                                type="button"
                                onClick={() => select(h.id)}
                                className="w-full rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--adm-surface-2)]"
                              >
                                <span className="flex items-center justify-between gap-2 text-xs text-[var(--adm-text-subtle)]">
                                  {formatRelative(h.date)}
                                  {!h.isReplied && <Badge tone="accent">Unread</Badge>}
                                </span>
                                <span className="mt-0.5 line-clamp-2 block text-sm text-[var(--adm-text)]">{h.body}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </>
          )}
        </div>
      </Panel>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => !busy && setConfirm(null)}
        onConfirm={doDelete}
        loading={busy}
        title={confirm?.ids.length > 1 ? `Delete ${confirm.ids.length} messages?` : "Delete this message?"}
        description="This permanently removes the message. This can't be undone."
      />
    </div>
  );
};

export default MessagesPage;
