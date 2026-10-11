'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
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
  PhoneIcon,
  TagIcon,
  TrashIcon,
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
  Spinner,
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

const STATUS_FILTERS = ["all", "unread", "replied"];

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

  const counts = useMemo(
    () => ({
      all: messages.length,
      unread: messages.filter((m) => !m.isReplied).length,
      replied: messages.filter((m) => m.isReplied).length,
    }),
    [messages]
  );

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

  // Select the first message on desktop once data arrives
  useEffect(() => {
    if (!loading && selectedId === null && visible.length > 0 && window.innerWidth >= 1024) {
      setSelectedId(visible[0].id);
    }
  }, [loading, visible, selectedId]);

  const select = useCallback((id) => {
    setSelectedId(id);
    setMobileDetail(true);
    const url = new URL(window.location.href);
    url.searchParams.set("id", id);
    window.history.replaceState(null, "", url);
  }, []);

  const go = useCallback(
    (delta) => {
      const next = visible[selectedIndex + delta];
      if (next) {
        select(next.id);
        listRef.current
          ?.querySelector(`[data-id="${next.id}"]`)
          ?.scrollIntoView({ block: "nearest" });
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

  // Keyboard shortcuts: j/k or arrows to move, r reply, e toggle replied, c copy
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
      } else if (selected && e.key === "r" && selected.email) {
        window.location.href = buildReplyHref(selected);
      } else if (selected && e.key === "e") {
        setReplied([selected.id], !selected.isReplied);
      } else if (selected && e.key === "c") {
        copyText(selected.body, "Message copied");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, selected, setReplied, confirm]);

  const toggleChecked = (id) =>
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const allVisibleChecked = visible.length > 0 && visible.every((m) => checkedIds.includes(m.id));

  if (loading) return <Spinner label="Loading messages…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description={
          counts.unread > 0
            ? `${counts.unread} unread of ${counts.all} contact form submissions`
            : `${counts.all} contact form submissions — you're all caught up`
        }
        actions={
          <Btn icon={ArrowPathIcon} loading={refreshing} onClick={() => fetchMessages({ silent: true })}>
            Refresh
          </Btn>
        }
      />

      {error && <ErrorBanner message={error} onRetry={() => fetchMessages()} />}

      <Panel className="grid overflow-hidden lg:h-[calc(100vh-13rem)] lg:min-h-[560px] lg:grid-cols-[minmax(320px,400px)_1fr]">
        {/* ───────── List column ───────── */}
        <div
          className={cn(
            "flex min-h-0 flex-col border-[var(--adm-border)] lg:border-r",
            mobileDetail && "hidden lg:flex"
          )}
        >
          <div className="space-y-3 border-b border-[var(--adm-border)] p-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search name, email, company, message…"
            />
            <div className="flex items-center justify-between gap-2">
              <Segmented
                value={status}
                onChange={setStatus}
                options={STATUS_FILTERS.map((s) => ({
                  value: s,
                  label: s[0].toUpperCase() + s.slice(1),
                  count: counts[s],
                }))}
              />
              <button
                type="button"
                onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]"
              >
                {sortDir === "desc" ? "Newest" : "Oldest"}
                {sortDir === "desc" ? <ChevronDownIcon className="h-3.5 w-3.5" /> : <ChevronUpIcon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Bulk bar */}
          {visible.length > 0 && (
            <div className="flex h-11 items-center gap-2 border-b border-[var(--adm-border)] px-3 text-xs text-[var(--adm-text-muted)]">
              <input
                type="checkbox"
                aria-label="Select all"
                checked={allVisibleChecked}
                onChange={() => setCheckedIds(allVisibleChecked ? [] : visible.map((m) => m.id))}
                className="h-4 w-4 rounded"
              />
              {checkedIds.length > 0 ? (
                <>
                  <span className="mr-auto">{checkedIds.length} selected</span>
                  <Btn size="sm" variant="ghost" icon={CheckCircleIcon} disabled={busy} onClick={() => setReplied(checkedIds, true)}>
                    Replied
                  </Btn>
                  <Btn size="sm" variant="ghost" icon={EnvelopeIcon} disabled={busy} onClick={() => setReplied(checkedIds, false)}>
                    Unread
                  </Btn>
                  <IconBtn icon={TrashIcon} label="Delete selected" variant="danger" disabled={busy} onClick={() => setConfirm({ ids: checkedIds })} />
                </>
              ) : (
                <span>
                  {visible.length} {visible.length === 1 ? "message" : "messages"}
                </span>
              )}
            </div>
          )}

          <ul ref={listRef} className="adm-scroll min-h-0 flex-1 divide-y divide-[var(--adm-border)] overflow-y-auto max-lg:max-h-[70vh]">
            {visible.length === 0 ? (
              <li>
                <EmptyState
                  icon={InboxIcon}
                  title={search || status !== "all" ? "No matching messages" : "No messages yet"}
                  description={
                    search || status !== "all"
                      ? "Try a different search or filter."
                      : "Submissions from the website contact form will appear here."
                  }
                />
              </li>
            ) : (
              visible.map((m) => {
                const active = m.id === selectedId;
                return (
                  <li
                    key={m.id}
                    data-id={m.id}
                    className={cn(
                      "relative flex cursor-pointer gap-3 px-3 py-3 transition-colors",
                      active ? "bg-[var(--adm-surface-2)]" : "hover:bg-[var(--adm-surface-hover)]/40"
                    )}
                    onClick={() => select(m.id)}
                  >
                    {active && <span className="absolute inset-y-0 left-0 w-0.5 bg-[var(--adm-accent)]" />}
                    <input
                      type="checkbox"
                      aria-label={`Select message from ${m.name}`}
                      checked={checkedIds.includes(m.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleChecked(m.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={cn(
                            "flex min-w-0 items-center gap-2 truncate text-sm",
                            m.isReplied ? "text-[var(--adm-text-muted)]" : "font-semibold text-[var(--adm-text)]"
                          )}
                        >
                          {!m.isReplied && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--adm-accent)]" aria-label="Unread" />}
                          <span className="truncate">{m.name}</span>
                        </p>
                        <time className="shrink-0 text-xs tabular-nums text-[var(--adm-text-subtle)]" dateTime={m.date || undefined}>
                          {formatRelative(m.date)}
                        </time>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[var(--adm-text-subtle)]">
                        {[m.company, m.email].filter(Boolean).join(" · ") || "No contact details"}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--adm-text-muted)]">
                        {m.subject ? <span className="text-[var(--adm-text)]">{m.subject} — </span> : null}
                        {m.body || "No message content"}
                      </p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* ───────── Reading pane ───────── */}
        <div className={cn("flex min-h-0 flex-col", !mobileDetail && "hidden lg:flex")}>
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={EnvelopeOpenIcon}
                title="Select a message"
                description="Choose a message from the list to read it in full, copy it, or reply."
              />
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--adm-border)] px-3 py-2.5 sm:px-4">
                <Btn
                  size="sm"
                  variant="ghost"
                  icon={ChevronLeftIcon}
                  className="lg:hidden"
                  onClick={() => setMobileDetail(false)}
                >
                  Inbox
                </Btn>
                <div className="flex items-center gap-1">
                  <IconBtn icon={ChevronUpIcon} label="Previous message (k)" disabled={selectedIndex <= 0} onClick={() => go(-1)} />
                  <IconBtn
                    icon={ChevronDownIcon}
                    label="Next message (j)"
                    disabled={selectedIndex === -1 || selectedIndex >= visible.length - 1}
                    onClick={() => go(1)}
                  />
                  {selectedIndex >= 0 && (
                    <span className="hidden px-1 text-xs tabular-nums text-[var(--adm-text-subtle)] sm:inline">
                      {selectedIndex + 1} / {visible.length}
                    </span>
                  )}
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <Btn
                    size="sm"
                    variant="secondary"
                    icon={selected.isReplied ? EnvelopeIcon : CheckCircleIcon}
                    disabled={busy}
                    onClick={() => setReplied([selected.id], !selected.isReplied)}
                    title="Toggle replied (e)"
                  >
                    {selected.isReplied ? "Mark unread" : "Mark replied"}
                  </Btn>
                  <IconBtn icon={TrashIcon} label="Delete message" variant="danger" onClick={() => setConfirm({ ids: [selected.id] })} />
                </div>
              </div>

              <div className="adm-scroll min-h-0 flex-1 overflow-y-auto">
                <article className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
                  {/* Sender */}
                  <header className="flex flex-wrap items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--adm-accent-soft)] text-sm font-semibold text-[#93c5fd]">
                      {getInitials(selected.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-[var(--adm-text)] select-text">{selected.name}</h2>
                        {selected.isReplied ? (
                          <Badge tone="success" dot>Replied</Badge>
                        ) : (
                          <Badge tone="accent" dot>Unread</Badge>
                        )}
                      </div>
                      {selected.email && (
                        <a
                          href={`mailto:${selected.email}`}
                          className="mt-0.5 inline-block break-all text-sm text-[#93c5fd] hover:underline"
                        >
                          {selected.email}
                        </a>
                      )}
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--adm-text-subtle)]">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {formatDateTime(selected.date)}
                      </p>
                    </div>
                  </header>

                  {selected.subject && (
                    <h3 className="mt-6 text-base font-semibold text-[var(--adm-text)] select-text">{selected.subject}</h3>
                  )}

                  {/* Message body — full text, selectable */}
                  <div className="mt-5 rounded-xl border border-[var(--adm-border)] bg-[var(--adm-bg)]/60">
                    <div className="flex items-center justify-between border-b border-[var(--adm-border)] px-4 py-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--adm-text-subtle)]">Message</span>
                      <Btn size="sm" variant="ghost" icon={ClipboardDocumentIcon} onClick={() => copyText(selected.body, "Message copied")}>
                        Copy
                      </Btn>
                    </div>
                    <p className="select-text whitespace-pre-wrap break-words px-4 py-4 text-[15px] leading-7 text-[var(--adm-text)]">
                      {selected.body || <span className="italic text-[var(--adm-text-subtle)]">No message content</span>}
                    </p>
                  </div>

                  {/* Primary actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.email && (
                      <a
                        href={buildReplyHref(selected)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--adm-accent-strong)] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--adm-accent)]"
                      >
                        <ArrowUturnLeftIcon className="h-4 w-4" />
                        Reply by email
                      </a>
                    )}
                    <Btn icon={ClipboardDocumentListIcon} onClick={() => copyText(buildDetailsText(selected), "Message and details copied")}>
                      Copy all details
                    </Btn>
                  </div>

                  {/* Contact details */}
                  <section className="mt-8">
                    <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--adm-text-subtle)]">Contact details</h4>
                    <dl className="grid gap-px overflow-hidden rounded-xl border border-[var(--adm-border)] bg-[var(--adm-border)] sm:grid-cols-2">
                      {[
                        { label: "Email", value: selected.email, icon: EnvelopeIcon, href: selected.email && `mailto:${selected.email}` },
                        { label: "Phone", value: selected.phone, icon: PhoneIcon, href: selected.phone && `tel:${selected.phone.replace(/\s+/g, "")}` },
                        { label: "Company", value: selected.company, icon: BuildingOffice2Icon },
                        { label: "Industry", value: selected.industry, icon: TagIcon },
                        { label: "Country", value: selected.country, icon: GlobeAltIcon },
                        { label: "Received", value: formatDateTime(selected.date), icon: ClockIcon },
                      ].map(({ label, value, icon: Icon, href }) => (
                        <div key={label} className="group flex items-start gap-3 bg-[var(--adm-surface)] px-4 py-3">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--adm-text-subtle)]" />
                          <div className="min-w-0 flex-1">
                            <dt className="text-xs text-[var(--adm-text-subtle)]">{label}</dt>
                            <dd className="mt-0.5 select-text break-words text-sm text-[var(--adm-text)]">
                              {value ? (
                                href ? (
                                  <a href={href} className="hover:text-[#93c5fd] hover:underline">
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
                          {value && value !== "—" && (
                            <IconBtn
                              icon={ClipboardDocumentIcon}
                              label={`Copy ${label.toLowerCase()}`}
                              className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus:opacity-100"
                              onClick={() => copyText(value, `${label} copied`)}
                            />
                          )}
                        </div>
                      ))}
                    </dl>
                  </section>

                  <p className="mt-8 hidden text-xs text-[var(--adm-text-subtle)] lg:block">
                    Shortcuts: <kbd className="rounded border border-[var(--adm-border-strong)] px-1">j</kbd> /{" "}
                    <kbd className="rounded border border-[var(--adm-border-strong)] px-1">k</kbd> next / previous ·{" "}
                    <kbd className="rounded border border-[var(--adm-border-strong)] px-1">r</kbd> reply ·{" "}
                    <kbd className="rounded border border-[var(--adm-border-strong)] px-1">e</kbd> toggle replied ·{" "}
                    <kbd className="rounded border border-[var(--adm-border-strong)] px-1">c</kbd> copy message
                  </p>
                </article>
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
