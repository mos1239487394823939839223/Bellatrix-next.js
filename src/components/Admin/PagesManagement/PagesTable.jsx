import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Badge, IconBtn, cn } from "../ui";

const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "—";

const SortHeader = ({ label, field, sortBy, sortDir, onSort, className = "" }) => {
  const active = sortBy === field;
  return (
    <th className={cn("px-4 py-3 font-medium", className)} aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-[var(--adm-text)]",
          active ? "text-[var(--adm-text)]" : ""
        )}
      >
        {label}
        {active &&
          (sortDir === "asc" ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />)}
      </button>
    </th>
  );
};

const PagesTable = ({
  pages,
  selectedIds,
  sortBy,
  sortDir,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  onView,
  onEdit,
  onDelete,
}) => {
  const allSelected = pages.length > 0 && pages.every((p) => selectedIds.includes(p.id));
  const sortProps = { sortBy, sortDir, onSort };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[var(--adm-border)] text-left text-xs text-[var(--adm-text-subtle)]">
          <tr>
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                aria-label="Select all pages on this page"
                onChange={onToggleSelectAll}
                checked={allSelected}
                className="h-4 w-4 rounded"
              />
            </th>
            <SortHeader label="Page" field="title" {...sortProps} />
            <SortHeader label="Category" field="categoryName" {...sortProps} className="hidden md:table-cell" />
            <th className="px-4 py-3 font-medium">Status</th>
            <SortHeader label="Sections" field="componentCount" {...sortProps} className="hidden lg:table-cell" />
            <SortHeader label="Created" field="createdAt" {...sortProps} className="hidden sm:table-cell" />
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--adm-border)]">
          {pages.map((page) => {
            const checked = selectedIds.includes(page.id);
            return (
              <tr
                key={page.id || page.slug}
                className={cn("group transition-colors", checked ? "bg-[var(--adm-accent-soft)]" : "hover:bg-[var(--adm-surface-2)]/50")}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${page.title || page.slug}`}
                    checked={checked}
                    onChange={() => onToggleSelect(page.id)}
                    className="h-4 w-4 rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => onEdit(page)} className="block min-w-[12rem] max-w-[22rem] text-left">
                    <span className="flex items-center gap-2 truncate font-medium text-[var(--adm-text)] group-hover:text-[var(--adm-accent-text)]">
                      {page.title || page.slug}
                      {page.isHomepage && (
                        <HomeIcon className="h-3.5 w-3.5 shrink-0 text-[var(--adm-warning)]" aria-label="Homepage" />
                      )}
                    </span>
                    <span className="block truncate font-mono text-xs text-[var(--adm-text-subtle)]">/{page.slug}</span>
                  </button>
                </td>
                <td className="hidden px-4 py-3 text-[var(--adm-text-muted)] md:table-cell">
                  {page.categoryName || <span className="text-[var(--adm-text-subtle)]">Uncategorized</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {page.isPublished ? <Badge tone="success" dot>Published</Badge> : <Badge dot>Draft</Badge>}
                    {page.isHomepage && <Badge tone="warning">Homepage</Badge>}
                  </div>
                </td>
                <td className="hidden px-4 py-3 tabular-nums text-[var(--adm-text-muted)] lg:table-cell">
                  {page.componentCount || 0}
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-[var(--adm-text-muted)] sm:table-cell">
                  {formatDate(page.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <IconBtn icon={EyeIcon} label="Preview" onClick={() => onView(page)} />
                    <IconBtn icon={PencilIcon} label="Edit" onClick={() => onEdit(page)} />
                    <IconBtn icon={TrashIcon} label="Delete" variant="danger" onClick={() => onDelete(page)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PagesTable;
