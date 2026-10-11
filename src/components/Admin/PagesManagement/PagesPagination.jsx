import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { IconBtn, cn } from "../ui";

const PagesPagination = ({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--adm-border)] px-4 py-3 text-sm">
      <p className="text-[var(--adm-text-muted)]">
        <span className="tabular-nums text-[var(--adm-text)]">{startIndex + 1}–{endIndex}</span> of{" "}
        <span className="tabular-nums text-[var(--adm-text)]">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1">
        <IconBtn
          icon={ChevronLeftIcon}
          label="Previous page"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) pageNum = i + 1;
          else if (currentPage <= 3) pageNum = i + 1;
          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
          else pageNum = currentPage - 2 + i;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={currentPage === pageNum ? "page" : undefined}
              className={cn(
                "h-8 min-w-8 rounded-lg px-2 text-sm tabular-nums transition-colors",
                currentPage === pageNum
                  ? "bg-[var(--adm-surface-2)] font-medium text-[var(--adm-text)]"
                  : "text-[var(--adm-text-muted)] hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]"
              )}
            >
              {pageNum}
            </button>
          );
        })}
        <IconBtn
          icon={ChevronRightIcon}
          label="Next page"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default PagesPagination;
