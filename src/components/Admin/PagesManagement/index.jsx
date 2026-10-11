'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import hotToast from "react-hot-toast";
import EditPageModal from "../EditPageModal";
import pagesAPI from "../../../lib/pagesAPI";
import { usePagesManagement } from "../../../hooks/usePagesManagement";
import PagesStats from "./PagesStats";
import PagesTable from "./PagesTable";
import PagesPagination from "./PagesPagination";
import ViewPageModal from "./ViewPageModal";
import DeletePageModal from "./DeletePageModal";
import {
  Btn,
  ConfirmDialog,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Panel,
  SearchInput,
  Spinner,
} from "../ui";

const PagesManagement = () => {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);

  const {
    pages,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortBy,
    sortDir,
    selectedIds,
    setSelectedIds,
    toast,
    filteredPages,
    paginatedPages,
    totalPages,
    startIndex,
    itemsPerPage,
    fetchPages,
    showToast,
    handleToggleSort,
    handleToggleSelect,
    handleToggleSelectAll,
  } = usePagesManagement();

  // The hook exposes toasts as state; surface them through the global toaster.
  useEffect(() => {
    if (!toast) return;
    if (toast.type === "error") hotToast.error(toast.message);
    else if (toast.type === "success") hotToast.success(toast.message);
    else hotToast(toast.message);
  }, [toast]);

  const fetchPageData = async (pageId) => {
    try {
      return await pagesAPI.getPageById(pageId);
    } catch (err) {
      showToast("Error fetching page data: " + err.message, "error");
      return null;
    }
  };

  const handleView = async (page) => {
    const fullPageData = await fetchPageData(page.id);
    if (fullPageData) {
      setSelectedPage(fullPageData);
      setShowViewModal(true);
    }
  };

  const handleEdit = async (page) => {
    const fullPageData = await fetchPageData(page.id);
    if (fullPageData) {
      setSelectedPage(fullPageData);
      setShowEditModal(true);
    }
  };

  const handleDelete = (page) => {
    setSelectedPage(page);
    setShowDeleteModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setOperationLoading(true);
      for (const id of selectedIds) {
        await pagesAPI.deletePage(id);
      }
      showToast(`Deleted ${selectedIds.length} page(s)`, "success");
      setSelectedIds([]);
      setShowBulkDelete(false);
      await fetchPages();
    } catch (err) {
      showToast("Error deleting selected pages: " + err.message, "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPage) return;
    try {
      setOperationLoading(true);
      await pagesAPI.deletePage(selectedPage.id);
      showToast(
        `Page "${selectedPage.title || selectedPage.slug}" deleted successfully`,
        "success"
      );
      await fetchPages();
      setShowDeleteModal(false);
      setSelectedPage(null);
    } catch (err) {
      showToast("Error deleting page: " + err.message, "error");
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) return <Spinner label="Loading pages…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages"
        description="Create, edit and publish the pages on your website."
        actions={
          <Btn variant="primary" icon={PlusIcon} onClick={() => router.push("/admin/pages/enhanced-create")}>
            New page
          </Btn>
        }
      />

      {error && <ErrorBanner message={`Couldn't load pages: ${error}`} onRetry={fetchPages} />}

      <PagesStats pages={pages} />

      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--adm-border)] p-3">
          <SearchInput
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              setCurrentPage(1);
            }}
            placeholder="Search by title, slug or category…"
            className="w-full sm:w-80"
          />
          <div className="ml-auto flex items-center gap-2">
            {selectedIds.length > 0 && (
              <>
                <span className="text-xs text-[var(--adm-text-muted)]">{selectedIds.length} selected</span>
                <Btn size="sm" variant="danger" icon={TrashIcon} onClick={() => setShowBulkDelete(true)}>
                  Delete
                </Btn>
              </>
            )}
            <Btn size="sm" variant="ghost" icon={ArrowPathIcon} onClick={fetchPages}>
              Refresh
            </Btn>
          </div>
        </div>

        {paginatedPages.length === 0 ? (
          <EmptyState
            icon={DocumentTextIcon}
            title={searchTerm ? "No pages match your search" : "No pages yet"}
            description={searchTerm ? "Try a different title, slug or category." : "Create your first page to get started."}
            action={
              !searchTerm && (
                <Btn variant="primary" icon={PlusIcon} onClick={() => router.push("/admin/pages/enhanced-create")}>
                  New page
                </Btn>
              )
            }
          />
        ) : (
          <>
            <PagesTable
              pages={paginatedPages}
              selectedIds={selectedIds}
              sortBy={sortBy}
              sortDir={sortDir}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onSort={handleToggleSort}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <PagesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              totalItems={filteredPages.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </Panel>

      <ViewPageModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        page={selectedPage}
      />

      <EditPageModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        page={selectedPage}
        onSave={fetchPages}
        showToast={showToast}
      />

      <DeletePageModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        page={selectedPage}
        onConfirm={confirmDelete}
        loading={operationLoading}
      />

      <ConfirmDialog
        open={showBulkDelete}
        onClose={() => !operationLoading && setShowBulkDelete(false)}
        onConfirm={handleBulkDelete}
        loading={operationLoading}
        title={`Delete ${selectedIds.length} page${selectedIds.length === 1 ? "" : "s"}?`}
        description="The selected pages and their sections will be permanently removed. This can't be undone."
        confirmLabel="Delete pages"
      />
    </div>
  );
};

export default PagesManagement;
