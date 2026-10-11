'use client'
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EyeIcon,
  InboxIcon,
  PhotoIcon,
  PlusIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import dashboardAPI from "../../lib/dashboardAPI";
import { getContactMessages } from "../../lib/contactMessagesAPI";
import { useAuth } from "../../hooks/useAuth";
import {
  Badge,
  Btn,
  EmptyState,
  Panel,
  PanelHeader,
  StatCard,
  cn,
  formatRelative,
  getInitials,
} from "./ui";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : "—");

const QUICK_LINKS = [
  { name: "Create a page", description: "Build a new page with the page builder", href: "/admin/pages/enhanced-create", icon: PlusIcon },
  { name: "Manage pages", description: "Edit, publish or remove pages", href: "/admin/pages", icon: DocumentTextIcon },
  { name: "Categories", description: "Organise the site navigation", href: "/admin/categories", icon: ViewColumnsIcon },
  { name: "Footer settings", description: "Contact info, links and social", href: "/admin/settings", icon: Cog6ToothIcon },
];

const ModernDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(null);
  const [media, setMedia] = useState(null);
  const [contact, setContact] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, m, c, msgs] = await Promise.allSettled([
      dashboardAPI.getPagesStats(),
      dashboardAPI.getMediaStats(),
      dashboardAPI.getContactStats(),
      getContactMessages(),
    ]);
    setPages(p.status === "fulfilled" ? p.value : null);
    setMedia(m.status === "fulfilled" ? m.value : null);
    setContact(c.status === "fulfilled" ? c.value : null);
    if (msgs.status === "fulfilled" && msgs.value.success) {
      const list = Array.isArray(msgs.value.data) ? msgs.value.data : msgs.value.data?.items || [];
      setRecentMessages(
        [...list]
          .sort(
            (a, b) =>
              new Date(b.submittedAt || b.createdAt || 0) - new Date(a.submittedAt || a.createdAt || 0)
          )
          .slice(0, 6)
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const name = user?.userName || user?.name || "";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const unread = contact?.unrepliedMessages;
  const publishedPct = pages?.total ? Math.round((pages.published / pages.total) * 100) : 0;
  const recentPages = pages?.recent || [];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-[var(--adm-text-subtle)]">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--adm-text)]">
            {greeting()}
            {name ? `, ${name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[var(--adm-text-muted)]">
            {loading
              ? "Loading your overview…"
              : unread > 0
                ? `You have ${unread} unread ${unread === 1 ? "message" : "messages"} waiting.`
                : "Your inbox is clear. Here's how the site looks today."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn icon={ArrowPathIcon} loading={loading} onClick={load} variant="ghost">
            Refresh
          </Btn>
          <Btn icon={PlusIcon} variant="primary" onClick={() => router.push("/admin/pages/enhanced-create")}>
            New page
          </Btn>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[118px] animate-pulse rounded-xl border border-[var(--adm-border)] bg-[var(--adm-surface)]" />
          ))
        ) : (
          <>
            <StatCard
              label="Unread messages"
              value={fmt(unread)}
              hint={contact ? `${fmt(contact.totalMessages)} total · ${fmt(contact.messagesThisWeek)} this week` : "Unavailable"}
              icon={InboxIcon}
              tone={unread > 0 ? "warning" : "success"}
              onClick={() => router.push("/admin/messages")}
            />
            <StatCard
              label="Pages"
              value={fmt(pages?.total)}
              hint={pages ? `${fmt(pages.published)} published · ${fmt(pages.unpublished)} drafts` : "Unavailable"}
              icon={DocumentTextIcon}
              onClick={() => router.push("/admin/pages")}
            />
            <StatCard
              label="Messages this month"
              value={fmt(contact?.messagesThisMonth)}
              hint={contact ? `${fmt(contact.messagesToday)} today` : "Unavailable"}
              icon={EyeIcon}
              tone="neutral"
            />
            <StatCard
              label="Media files"
              value={fmt(media?.totalMedia)}
              hint={media ? `${fmt(media.totalImages)} images · ${media.totalSizeFormatted || "0 B"}` : "Unavailable"}
              icon={PhotoIcon}
              tone="neutral"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent messages */}
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Recent messages"
            description="Latest contact form submissions"
            actions={
              <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm text-[#93c5fd] hover:underline">
                Open inbox <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {loading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--adm-surface-2)]" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <EmptyState icon={InboxIcon} title="No messages yet" description="New contact form submissions will show up here." />
          ) : (
            <ul className="divide-y divide-[var(--adm-border)]">
              {recentMessages.map((m) => {
                const sender = (m.fullName || m.name || "Unknown sender").trim();
                return (
                  <li key={m.id}>
                    <Link
                      href={`/admin/messages?id=${m.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--adm-surface-2)]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--adm-surface-2)] text-xs font-semibold text-[var(--adm-text-muted)]">
                        {getInitials(sender)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("truncate text-sm", m.isReplied ? "text-[var(--adm-text-muted)]" : "font-semibold text-[var(--adm-text)]")}>
                            {sender}
                          </p>
                          {!m.isReplied && <Badge tone="accent">New</Badge>}
                        </div>
                        <p className="truncate text-sm text-[var(--adm-text-subtle)]">{m.message}</p>
                      </div>
                      <time className="shrink-0 text-xs tabular-nums text-[var(--adm-text-subtle)]">
                        {formatRelative(m.submittedAt || m.createdAt)}
                      </time>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Quick links */}
        <Panel>
          <PanelHeader title="Quick actions" />
          <ul className="p-2">
            {QUICK_LINKS.map(({ name: label, description, href, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--adm-surface-2)]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--adm-accent-soft)] text-[#93c5fd]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--adm-text)]">{label}</span>
                    <span className="block truncate text-xs text-[var(--adm-text-subtle)]">{description}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-[var(--adm-text-subtle)] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
            <li>
              <a href="/" target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--adm-surface-2)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--adm-surface-2)] text-[var(--adm-text-muted)]">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[var(--adm-text)]">View live site</span>
                  <span className="block truncate text-xs text-[var(--adm-text-subtle)]">Opens in a new tab</span>
                </span>
              </a>
            </li>
          </ul>
        </Panel>
      </div>

      {/* Pages overview */}
      <Panel>
        <PanelHeader
          title="Pages"
          description={pages ? `${publishedPct}% of pages are published` : undefined}
          actions={
            <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-[#93c5fd] hover:underline">
              All pages <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          }
        />
        {pages && pages.total > 0 && (
          <div className="px-5 pt-4">
            <div className="flex h-2 overflow-hidden rounded-full bg-[var(--adm-surface-2)]">
              <div className="bg-[var(--adm-success)]" style={{ width: `${publishedPct}%` }} />
            </div>
            <div className="mt-2 flex gap-4 text-xs text-[var(--adm-text-muted)]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--adm-success)]" />{pages.published} published</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--adm-surface-hover)]" />{pages.unpublished} drafts</span>
            </div>
          </div>
        )}
        {loading ? (
          <div className="h-32 animate-pulse" />
        ) : recentPages.length === 0 ? (
          <EmptyState
            icon={DocumentTextIcon}
            title={pages ? "No pages yet" : "Couldn't load pages"}
            action={pages && <Btn variant="primary" icon={PlusIcon} onClick={() => router.push("/admin/pages/enhanced-create")}>Create page</Btn>}
          />
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[var(--adm-border)]">
                {recentPages.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--adm-surface-2)]/50">
                    <td className="px-3 py-2.5">
                      <p className="font-medium text-[var(--adm-text)]">{p.title || p.name || p.slug}</p>
                      <p className="font-mono text-xs text-[var(--adm-text-subtle)]">/{p.slug}</p>
                    </td>
                    <td className="hidden px-3 py-2.5 text-[var(--adm-text-muted)] sm:table-cell">{p.categoryName || "Uncategorized"}</td>
                    <td className="px-3 py-2.5">
                      {p.isPublished ? <Badge tone="success" dot>Published</Badge> : <Badge dot>Draft</Badge>}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link href={`/admin/pages/enhanced-edit/${p.id}`} className="text-sm text-[#93c5fd] hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};

export default ModernDashboard;
