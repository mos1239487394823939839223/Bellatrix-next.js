'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../UI/Button";
import Card, { CardContent, CardHeader, CardTitle } from "../../UI/Card";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import Toast from "../../UI/Toast";
import EditPageModal from "../EditPageModal";
import pagesAPI from "../../../lib/pagesAPI";
import { usePagesManagement } from "../../../hooks/usePagesManagement";
import PagesStats from "./PagesStats";
import PagesTable from "./PagesTable";
import PagesPagination from "./PagesPagination";
import ViewPageModal from "./ViewPageModal";
import DeletePageModal from "./DeletePageModal";

const PagesManagement = () => {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  if (loading) {
    return (
      <div
        className="admin-component flex items-center justify-center h-64"
        data-dashboard="true"
      >
        <div className="flex items-center space-x-2">
          <ArrowPathIcon className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
          <span className="text-[var(--color-text-secondary)]">
            Loading pages...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="admin-component flex items-center justify-center h-64"
        data-dashboard="true"
      >
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-[var(--tw-red-500)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-inverse)] mb-2">
            Error Loading Pages
          </h3>
          <p className="text-[var(--color-ww-100)] mb-4">{error}</p>
          <Button onClick={fetchPages} variant="outline">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-component space-y-6 text-white" data-dashboard="true">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pages Management</h2>
          <p className="text-gray-300">Manage your website pages and content</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => router.push("/admin/pages/enhanced-create")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Enhanced Page Builder
          </Button>
        </div>
      </div>

      <PagesStats pages={pages} />

      <Card className="bg-white/10 border border-white/20 shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <DocumentTextIcon className="h-4 w-4 text-white/90" />
              </div>
              <CardTitle className="text-lg font-semibold text-white">
                All Pages
              </CardTitle>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/90 border border-white/20">
                {filteredPages.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-3 py-2 text-sm border border-white/20 bg-white/5 text-white placeholder:text-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchPages}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  loading={operationLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedPages.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              No pages found
            </div>
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
        </CardContent>
      </Card>

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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PagesManagement;

