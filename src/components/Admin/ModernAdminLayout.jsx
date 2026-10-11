'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ViewColumnsIcon,
  Cog6ToothIcon,
  PowerIcon,
  InboxIcon,
  KeyIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useMessageNotifications } from "../../hooks/useMessageNotifications";
import MessageNotification from "./MessageNotification";
import { cn, getInitials } from "./ui";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon, description: "Overview of your site and inbox" },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "pages", name: "Pages", path: "/admin/pages", icon: DocumentTextIcon, description: "Create and manage website pages" },
      { id: "categories", name: "Categories", path: "/admin/categories", icon: ViewColumnsIcon, description: "Group pages in the site navigation" },
    ],
  },
  {
    label: "Inbox",
    items: [
      { id: "messages", name: "Messages", path: "/admin/messages", icon: InboxIcon, description: "Contact form submissions", badge: "unread" },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", name: "Settings", path: "/admin/settings", icon: Cog6ToothIcon, description: "Footer and site-wide settings" },
    ],
  },
];

const ALL_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

const SUB_PAGES = [
  { prefix: "/admin/pages/enhanced-create", parent: "pages", name: "New page" },
  { prefix: "/admin/pages/enhanced-edit", parent: "pages", name: "Edit page" },
  { prefix: "/admin/change-password", parent: null, name: "Change password", description: "Update your account password" },
];

const ModernAdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "";
  const { logout, user } = useAuth();
  const isEnhancedBuilder =
    pathname.startsWith("/admin/pages/enhanced-create") ||
    pathname.startsWith("/admin/pages/enhanced-edit");

  const { notifications, unreadCount, removeNotification } = useMessageNotifications();

  // The messages page broadcasts the live unread count after every change,
  // so the sidebar badge stays accurate without another request.
  const [liveUnread, setLiveUnread] = useState(null);
  useEffect(() => {
    const onCount = (e) => setLiveUnread(e.detail);
    window.addEventListener("admin:unread-count", onCount);
    return () => window.removeEventListener("admin:unread-count", onCount);
  }, []);
  const unread = liveUnread ?? unreadCount;

  useEffect(() => setSidebarOpen(false), [pathname]);

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");
  const activeItem = ALL_ITEMS.find((item) => isActive(item.path));
  const subPage = SUB_PAGES.find((p) => pathname.startsWith(p.prefix));
  const parentItem = subPage?.parent ? ALL_ITEMS.find((i) => i.id === subPage.parent) : null;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const displayName = user?.userName || user?.name || user?.email || "Admin";

  return (
    <div className="admin-layout dark flex min-h-screen" data-dashboard="true">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--adm-border)] bg-[var(--adm-sidebar)] transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--adm-accent-strong)] text-sm font-bold text-white">
              B
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-[var(--adm-text)]">Bellatrix</span>
              <span className="block text-[11px] text-[var(--adm-text-subtle)]">Admin console</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface-2)] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="adm-scroll flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-[var(--adm-text-subtle)]">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-[var(--adm-surface-2)] text-[var(--adm-text)]"
                            : "text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface)] hover:text-[var(--adm-text)]"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            active ? "text-[var(--adm-accent)]" : "text-[var(--adm-text-subtle)] group-hover:text-[var(--adm-text-muted)]"
                          )}
                        />
                        <span className="flex-1">{item.name}</span>
                        {item.badge === "unread" && unread > 0 && (
                          <span className="min-w-[1.25rem] rounded-full bg-[var(--adm-accent-strong)] px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums text-white">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-[var(--adm-border)] p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--adm-surface-2)] text-xs font-semibold text-[var(--adm-text)]">
              {getInitials(displayName)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--adm-text)]">{displayName}</p>
              <p className="truncate text-xs text-[var(--adm-text-subtle)]">{user?.role || "Administrator"}</p>
            </div>
          </div>
          <div className="mt-1 space-y-0.5">
            <Link
              href="/admin/change-password"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive("/admin/change-password")
                  ? "bg-[var(--adm-surface-2)] text-[var(--adm-text)]"
                  : "text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface)] hover:text-[var(--adm-text)]"
              )}
            >
              <KeyIcon className="h-4 w-4" />
              Change password
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--adm-text-muted)] transition-colors hover:bg-[var(--adm-danger-soft)] hover:text-[var(--adm-danger)]"
            >
              <PowerIcon className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--adm-border)] bg-[var(--adm-bg)]/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                className="rounded-lg p-1.5 text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface-2)] lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
                <span className="hidden text-[var(--adm-text-subtle)] sm:inline">Admin</span>
                <ChevronRightIcon className="hidden h-3.5 w-3.5 text-[var(--adm-text-subtle)] sm:inline" />
                {parentItem ? (
                  <>
                    <Link href={parentItem.path} className="text-[var(--adm-text-muted)] hover:text-[var(--adm-text)]">
                      {parentItem.name}
                    </Link>
                    <ChevronRightIcon className="h-3.5 w-3.5 text-[var(--adm-text-subtle)]" />
                    <span className="truncate font-medium text-[var(--adm-text)]">{subPage.name}</span>
                  </>
                ) : (
                  <span className="truncate font-medium text-[var(--adm-text)]">
                    {subPage?.name || activeItem?.name || "Dashboard"}
                  </span>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href="/admin/messages"
                aria-label={`Messages, ${unread} unread`}
                className="relative rounded-lg p-2 text-[var(--adm-text-muted)] transition-colors hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]"
              >
                <InboxIcon className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--adm-accent)] ring-2 ring-[var(--adm-bg)]" />
                )}
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--adm-border-strong)] px-3 py-1.5 text-sm text-[var(--adm-text)] transition-colors hover:bg-[var(--adm-surface-2)]"
              >
                <span className="hidden sm:inline">View site</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        <main
          className={cn(
            "flex-1",
            pathname.startsWith("/admin/pages/enhanced-create") ? "p-0" : "p-4 sm:p-6 lg:p-8"
          )}
        >
          {isEnhancedBuilder ? children : <div className="mx-auto w-full max-w-[1400px]">{children}</div>}
        </main>
      </div>

      {/* Live new-message popups */}
      {!pathname.startsWith("/admin/messages") &&
        notifications.map((notification) => (
          <MessageNotification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            onReply={(msg) => router.push(msg?.id ? `/admin/messages?id=${msg.id}` : "/admin/messages")}
            onView={(msg) => router.push(msg?.id ? `/admin/messages?id=${msg.id}` : "/admin/messages")}
          />
        ))}
    </div>
  );
};

export default ModernAdminLayout;
