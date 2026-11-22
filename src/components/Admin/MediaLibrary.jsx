'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowUpTrayIcon,
  PhotoIcon,
  FilmIcon,
  TrashIcon,
  PencilIcon,
  LinkIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import {
  Btn,
  ConfirmDialog,
  Dialog,
  EmptyState,
  ErrorBanner,
  Field,
  IconBtn,
  PageHeader,
  Panel,
  SearchInput,
  Segmented,
  Spinner,
  copyText,
  formatDateTime,
  inputClass,
} from "./ui";
import OptimizedImg from "../OptimizedImg";
import {
  MEDIA_MAX_MB,
  deleteMedia,
  fileNameOf,
  formatBytes,
  listMedia,
  mediaKind,
  mediaUrl,
  referencedFileNames,
  updateMedia,
  uploadFile,
  validateFile,
} from "../../lib/mediaService";

const PAGE_SIZE = 48;
const FILTERS = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "unused", label: "Not used" },
];

const absoluteUrl = (url) =>
  url.startsWith("http") ? url : `${typeof window !== "undefined" ? window.location.origin : ""}${url}`;

const displayName = (item) => item.originalName || item.fileName || item.alternateText || `Media #${item.id}`;

/** Thumbnail for a grid card / dialog. */
function Thumb({ item, large = false }) {
  const kind = mediaKind(item);
  const src = mediaUrl(item.fileUrl);
  if (kind === "image") {
    return (
      <OptimizedImg
        src={src}
        alt={item.alternateText || ""}
        sizes={large ? "640px" : "(max-width: 640px) 50vw, 220px"}
        loading="lazy"
        className={large ? "max-h-[60vh] w-full object-contain" : "h-full w-full object-cover"}
      />
    );
  }
  if (kind === "video") {
    return large ? (
      <video src={src} controls playsInline preload="metadata" className="max-h-[60vh] w-full bg-black" />
    ) : (
      <>
        <video src={`${src}#t=0.5`} muted playsInline preload="metadata" className="h-full w-full object-cover" aria-hidden="true" tabIndex={-1} />
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-black/65 px-1.5 py-0.5 text-[11px] font-medium text-white">
          <FilmIcon className="h-3 w-3" /> Video
        </span>
      </>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-[var(--adm-text-subtle)]">
      <DocumentIcon className="h-8 w-8" />
    </div>
  );
}

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [uploads, setUploads] = useState([]); // { key, name, progress, error, done }
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef(null);

  const [editing, setEditing] = useState(null); // item
  const [form, setForm] = useState({ alternateText: "", caption: "" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [usedNames, setUsedNames] = useState(null); // Set of file names used by published pages

  useEffect(() => {
    referencedFileNames().then(({ names }) => setUsedNames(names)).catch(() => setUsedNames(null));
  }, []);
  const isUnused = (item) => usedNames && !usedNames.has(fileNameOf(item));
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (p = 1) => {
      p === 1 ? setLoading(true) : setLoadingMore(true);
      setError(null);
      try {
        // "Not used" lists everything and filters on this page (needs all files)
        const unusedView = filter === "unused";
        const res = await listMedia({
          page: unusedView ? 1 : p,
          pageSize: unusedView ? 1000 : PAGE_SIZE,
          type: unusedView ? "all" : filter,
          searchTerm: debounced,
        });
        setItems((prev) => (p === 1 ? res.items : [...prev, ...res.items]));
        setHasMore(res.hasMore);
        setPage(p);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter, debounced]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  // ---------- upload ----------
  const startUploads = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []);
      if (!files.length) return;
      const queue = files.map((f, i) => ({ key: `${Date.now()}-${i}`, file: f, name: f.name, progress: 0, error: validateFile(f), done: false }));
      setUploads((u) => [...queue.map((q) => ({ key: q.key, name: q.name, progress: q.progress, error: q.error, done: q.done })), ...u]);

      let ok = 0;
      for (const q of queue) {
        if (q.error) continue;
        try {
          await uploadFile(q.file, {
            onProgress: (p) => setUploads((u) => u.map((x) => (x.key === q.key ? { ...x, progress: p } : x))),
          });
          ok += 1;
          setUploads((u) => u.map((x) => (x.key === q.key ? { ...x, progress: 100, done: true } : x)));
        } catch (e) {
          setUploads((u) => u.map((x) => (x.key === q.key ? { ...x, error: e.message } : x)));
        }
      }
      if (ok) {
        toast.success(`${ok} file${ok > 1 ? "s" : ""} uploaded`);
        load(1);
        // clear finished rows after a moment; keep failures visible
        setTimeout(() => setUploads((u) => u.filter((x) => !x.done)), 4000);
      }
    },
    [load]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    startUploads(e.dataTransfer.files);
  };

  // ---------- edit ----------
  const openEdit = (item) => {
    setEditing(item);
    setForm({ alternateText: item.alternateText || "", caption: item.caption || "" });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await updateMedia(editing.id, { ...form, role: editing.role, sortOrder: editing.sortOrder });
      setItems((list) => list.map((x) => (x.id === editing.id ? { ...x, ...form } : x)));
      toast.success("Media details saved");
      setEditing(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- delete ----------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMedia(deleteTarget.id);
      setItems((list) => list.filter((x) => x.id !== deleteTarget.id));
      toast.success("Media deleted");
      if (editing?.id === deleteTarget.id) setEditing(null);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (item) => copyText(absoluteUrl(mediaUrl(item.fileUrl)), "Link copied");

  const pendingUploads = uploads.filter((u) => !u.done || u.error);
  const visible = filter === "unused" ? items.filter(isUnused) : items;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media"
        description={`Images and videos used on your pages. Upload, rename, copy links or delete files. Max ${MEDIA_MAX_MB} MB per file.`}
        actions={
          <Btn variant="primary" icon={ArrowUpTrayIcon} onClick={() => fileInput.current?.click()}>
            Upload
          </Btn>
        }
      />
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          startUploads(e.target.files);
          e.target.value = "";
        }}
      />

      {pendingUploads.length > 0 && (
        <Panel className="divide-y divide-[var(--adm-border)]">
          {pendingUploads.map((u) => (
            <div key={u.key} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="min-w-0 flex-1 truncate text-[var(--adm-text)]">{u.name}</span>
              {u.error ? (
                <span className="flex items-center gap-3 text-[var(--adm-danger)]">
                  {u.error}
                  <button type="button" className="text-xs text-[var(--adm-text-muted)] underline" onClick={() => setUploads((list) => list.filter((x) => x.key !== u.key))}>
                    Dismiss
                  </button>
                </span>
              ) : (
                <span className="flex w-48 items-center gap-3">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--adm-surface-2)]">
                    <span className="block h-full rounded-full bg-[var(--adm-accent)] transition-[width] duration-200" style={{ width: `${u.progress}%` }} />
                  </span>
                  <span className="w-10 text-right tabular-nums text-[var(--adm-text-muted)]">{u.progress}%</span>
                </span>
              )}
            </div>
          ))}
        </Panel>
      )}

      <Panel
        className={`overflow-hidden transition-shadow ${dragging ? "ring-2 ring-[var(--adm-accent)]" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={onDrop}
      >
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--adm-border)] p-3">
          <Segmented options={FILTERS} value={filter} onChange={setFilter} />
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name…" className="w-full sm:w-72" />
          {!loading && (
            <span className="ml-auto text-xs text-[var(--adm-text-muted)]">
              {visible.length}
              {hasMore && filter !== "unused" ? "+" : ""} {visible.length === 1 ? "file" : "files"}
              {filter === "unused" ? " not used on any published page" : " · drop files here to upload"}
            </span>
          )}
        </div>

        {error ? (
          <div className="p-4">
            <ErrorBanner message={error} onRetry={() => load(1)} />
          </div>
        ) : loading ? (
          <Spinner label="Loading media…" />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={PhotoIcon}
            title={filter === "unused" ? (usedNames ? "Every file is used on a page" : "Checking which files are used…") : debounced || filter !== "all" ? "No media matches" : "No media yet"}
            description={debounced || filter !== "all" ? "Try another search or filter." : "Upload images and videos, or drag them onto this panel."}
            action={<Btn variant="primary" icon={ArrowUpTrayIcon} onClick={() => fileInput.current?.click()}>Upload</Btn>}
          />
        ) : (
          <div className="p-4">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visible.map((item) => (
                <li key={item.id} className="group overflow-hidden rounded-lg border border-[var(--adm-border)] bg-[var(--adm-surface)]">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-[var(--adm-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--adm-accent)]"
                    aria-label={`Open ${displayName(item)}`}
                  >
                    <Thumb item={item} />
                    {isUnused(item) && (
                      <span className="absolute right-2 top-2 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">
                        Not used
                      </span>
                    )}
                  </button>
                  <div className="px-2.5 pt-2">
                    <p className="truncate text-xs font-medium text-[var(--adm-text)]" title={displayName(item)}>
                      {displayName(item)}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 px-2.5 pb-1.5">
                    <span className="flex-1 text-[11px] text-[var(--adm-text-subtle)]">{formatBytes(item.fileSizeInBytes)}</span>
                    <IconBtn icon={LinkIcon} label="Copy link" onClick={() => copyUrl(item)} />
                    <IconBtn icon={PencilIcon} label="Edit details" onClick={() => openEdit(item)} />
                    <IconBtn icon={TrashIcon} label="Delete" variant="danger" onClick={() => setDeleteTarget(item)} />
                  </div>
                </li>
              ))}
            </ul>
            {hasMore && filter !== "unused" && (
              <div className="mt-6 flex justify-center">
                <Btn onClick={() => load(page + 1)} loading={loadingMore}>
                  Load more
                </Btn>
              </div>
            )}
          </div>
        )}
      </Panel>

      {/* Details / edit */}
      <Dialog
        open={!!editing}
        onClose={() => !saving && setEditing(null)}
        title="Media details"
        description={editing ? displayName(editing) : ""}
        size="lg"
        footer={
          editing && (
            <>
              <Btn variant="danger" icon={TrashIcon} onClick={() => setDeleteTarget(editing)} className="mr-auto">
                Delete
              </Btn>
              <Btn onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </Btn>
              <Btn variant="primary" type="submit" form="media-edit-form" loading={saving}>
                Save
              </Btn>
            </>
          )
        }
      >
        {editing && (
          <form id="media-edit-form" onSubmit={save} className="space-y-4">
            <div className="relative flex items-center justify-center overflow-hidden rounded-lg bg-[var(--adm-surface-2)]">
              <Thumb item={editing} large />
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
              <div><dt className="text-[var(--adm-text-subtle)]">Type</dt><dd className="capitalize text-[var(--adm-text)]">{mediaKind(editing)}</dd></div>
              <div><dt className="text-[var(--adm-text-subtle)]">Size</dt><dd className="text-[var(--adm-text)]">{formatBytes(editing.fileSizeInBytes)}</dd></div>
              <div className="col-span-2"><dt className="text-[var(--adm-text-subtle)]">Uploaded</dt><dd className="text-[var(--adm-text)]">{editing.createdAt ? formatDateTime(editing.createdAt) : "—"}</dd></div>
            </dl>
            <Field label="Link" htmlFor="media-url" hint="Paste this into any media field, or use Browse in the page editor.">
              <div className="flex gap-2">
                <input id="media-url" readOnly className={`${inputClass} font-mono text-xs`} value={absoluteUrl(mediaUrl(editing.fileUrl))} onFocus={(e) => e.target.select()} />
                <Btn icon={LinkIcon} onClick={() => copyUrl(editing)}>Copy</Btn>
              </div>
            </Field>
            <Field label="Alt text" htmlFor="media-alt" hint="Describes the image for screen readers and search engines.">
              <input
                id="media-alt"
                className={inputClass}
                value={form.alternateText}
                onChange={(e) => setForm((f) => ({ ...f, alternateText: e.target.value }))}
                placeholder="e.g. HR dashboard showing leave balances"
              />
            </Field>
            <Field label="Caption" htmlFor="media-caption">
              <textarea
                id="media-caption"
                rows={2}
                className={inputClass}
                value={form.caption}
                onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                placeholder="Optional"
              />
            </Field>
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this file?"
        description={
          deleteTarget
            ? usedNames && !isUnused(deleteTarget)
              ? `Warning: "${displayName(deleteTarget)}" is used on a published page. Deleting it will leave an empty image or video there until you pick another file.`
              : `"${displayName(deleteTarget)}" will be permanently removed from the server.`
            : ""
        }
      />
    </div>
  );
}
