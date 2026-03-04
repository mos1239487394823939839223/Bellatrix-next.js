'use client'
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const ITEMS_PER_PAGE = 10;

  // Show toast notification
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Fetch pages from API
  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pagesAPI.getPages();
      console.log("[PagesManagement] Initial pages data:", data);
      
      // Fetch full page data to get component counts
      const pagesWithComponentCounts = await Promise.all(
        data.map(async (page) => {
          try {
            // Get full page data which includes components
            const fullPage = await pagesAPI.getPageById(page.id);
            console.log(`[PagesManagement] Full page data for ID ${page.id}:`, fullPage);
            console.log(`[PagesManagement] Page keys:`, Object.keys(fullPage || {}));
            
            const componentCount = fullPage?.components?.length || 
                                   fullPage?.pageComponents?.length || 
                                   fullPage?.Components?.length ||
                                   fullPage?.PageComponents?.length || 0;
            console.log(`[PagesManagement] Component count for page ${page.id}:`, componentCount);
            
            return {
              ...page,
              componentCount
            };
          } catch (err) {
            console.warn(`Failed to fetch page details for ${page.id}:`, err);
            return { ...page, componentCount: 0 };
          }
        })
      );
      
      console.log("[PagesManagement] Final pages with counts:", pagesWithComponentCounts);
      setPages(pagesWithComponentCounts);
    } catch (err) {
      setError(err.message);
      showToast("Error fetching pages: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch single page data
  const fetchPageData = async (pageId) => {
    try {
      return await pagesAPI.getPageById(pageId);
    } catch (err) {
      showToast("Error fetching page data: " + err.message, "error");
      return null;
    }
  };

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // Filter and paginate pages
  const filteredPages = pages.filter(
    (page) =>
      (page.title &&
        page.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (page.slug &&
        page.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (page.categoryName &&
        page.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPages = [...filteredPages].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const getVal = (p, key) => {
      if (key === "createdAt") return new Date(p.createdAt || 0).getTime();
      if (key === "title") return (p.title || "").toLowerCase();
      if (key === "slug") return (p.slug || "").toLowerCase();
      if (key === "categoryName") return (p.categoryName || "").toLowerCase();
      if (key === "componentCount") return Number(p.componentCount || 0);
      return p[key];
    };
    const av = getVal(a, sortBy);
    const bv = getVal(b, sortBy);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const totalPages = Math.ceil(sortedPages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPages = sortedPages.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handle page operations
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

  const handleToggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = paginatedPages.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(
      allSelected
        ? selectedIds.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...selectedIds, ...pageIds]))
    );
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
        `Page "${
          selectedPage.title || selectedPage.slug
        }" deleted successfully`,
        "success"
      );
      await fetchPages(); // Refresh the list
      setShowDeleteModal(false);
      setSelectedPage(null);
    } catch (err) {
      showToast("Error deleting page: " + err.message, "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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



      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="bg-white/10 border border-white/20 shadow transition-all duration-200">

          <CardContent className="p-6">

            <div className="flex items-center">

              <div className="p-2 bg-white/10 border border-white/20 rounded-lg">

                <DocumentTextIcon className="h-6 w-6 text-white/90" />

              </div>

              <div className="ml-4">

                <p className="text-sm font-medium text-gray-300">Total Pages</p>

                <p className="text-2xl font-bold text-white">{pages.length}</p>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="bg-white/10 border border-white/20 shadow transition-all duration-200">

          <CardContent className="p-6">

            <div className="flex items-center">

              <div className="p-2 bg-white/10 border border-white/20 rounded-lg">

                <CheckCircleIcon className="h-6 w-6 text-white/90" />

              </div>

              <div className="ml-4">

                <p className="text-sm font-medium text-gray-300">Published</p>

                <p className="text-2xl font-bold text-white">

                  {pages.filter((p) => p.isPublished).length}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="bg-white/10 border border-white/20 shadow transition-all duration-200">

          <CardContent className="p-6">

            <div className="flex items-center">

              <div className="p-2 bg-white/10 border border-white/20 rounded-lg">

                <CalendarIcon className="h-6 w-6 text-white/90" />

              </div>

              <div className="ml-4">

                <p className="text-sm font-medium text-gray-300">

                  Last Created

                </p>

                <p className="text-sm font-bold text-white">

                  {pages.length > 0

                    ? formatDate(

                        Math.max(

                          ...pages.map((p) => new Date(p.createdAt || 0))

                        )

                      )

                    : "N/A"}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>



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

          {sortedPages.length === 0 ? (

            <div className="text-center py-16 text-gray-300">

              No pages found

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full text-sm">

                <thead className="bg-white/5 text-gray-300 border-b border-white/10">

                  <tr>

                    <th className="px-4 py-3 text-left w-10">

                      <input

                        type="checkbox"

                        onChange={handleToggleSelectAll}

                        checked={

                          paginatedPages.length > 0 &&

                          paginatedPages.every((p) =>

                            selectedIds.includes(p.id)

                          )

                        }

                        className="rounded border-white/30 bg-white/10 text-blue-400 focus:ring-blue-500"

                      />

                    </th>

                    <th

                      className="px-4 py-3 text-left cursor-pointer select-none"

                      onClick={() => handleToggleSort("title")}

                    >

                      <div className="inline-flex items-center gap-1">

                        <span className="text-white">Title</span>

                        {sortBy === "title" && (

                          <span className="text-xs text-gray-400">

                            {sortDir === "asc" ? "" : ""}

                          </span>

                        )}

                      </div>

                    </th>

                    <th

                      className="px-4 py-3 text-left cursor-pointer select-none"

                      onClick={() => handleToggleSort("slug")}

                    >

                      {" "}

                      <span className="text-white">Slug</span>{" "}

                      {sortBy === "slug" && (

                        <span className="text-xs text-gray-400">

                          {sortDir === "asc" ? "" : ""}

                        </span>

                      )}

                    </th>

                    <th

                      className="px-4 py-3 text-left cursor-pointer select-none"

                      onClick={() => handleToggleSort("categoryName")}

                    >

                      {" "}

                      <span className="text-white">Category</span>{" "}

                      {sortBy === "categoryName" && (

                        <span className="text-xs text-gray-400">

                          {sortDir === "asc" ? "" : ""}

                        </span>

                      )}

                    </th>

                    <th className="px-4 py-3 text-left text-white">

                      Published

                    </th>

                    <th className="px-4 py-3 text-left text-white">Homepage</th>

                    <th

                      className="px-4 py-3 text-left cursor-pointer select-none"

                      onClick={() => handleToggleSort("componentCount")}

                    >

                      <span className="text-white">Components</span>{" "}

                      {sortBy === "componentCount" && (

                        <span className="text-xs text-gray-400">

                          {sortDir === "asc" ? "" : ""}

                        </span>

                      )}

                    </th>

                    <th

                      className="px-4 py-3 text-left cursor-pointer select-none"

                      onClick={() => handleToggleSort("createdAt")}

                    >

                      <span className="text-white">Created</span>{" "}

                      {sortBy === "createdAt" && (

                        <span className="text-xs text-gray-400">

                          {sortDir === "asc" ? "" : ""}

                        </span>

                      )}

                    </th>

                    <th className="px-4 py-3 text-right text-white">Actions</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-white/10">

                  {paginatedPages.map((page) => (

                    <tr key={page.id || page.slug} className="hover:bg-white/5">

                      <td className="px-4 py-2">

                        <input

                          type="checkbox"

                          checked={selectedIds.includes(page.id)}

                          onChange={() => handleToggleSelect(page.id)}

                          className="rounded border-white/30 bg-white/10 text-blue-400 focus:ring-blue-500"

                        />

                      </td>

                      <td className="px-4 py-2">

                        <div className="flex items-center gap-2 min-w-[12rem]">

                          <div className="w-7 h-7 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">

                            <DocumentTextIcon className="h-4 w-4 text-white/90" />

                          </div>

                          <div className="truncate">

                            <div className="font-medium text-white truncate">

                              {page.title || page.slug}

                            </div>

                            <div className="text-xs text-gray-400 truncate">

                              ID: {page.id}

                            </div>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-2 text-gray-300 font-mono">

                        /{page.slug}

                      </td>

                      <td className="px-4 py-2 text-gray-300">

                        {page.categoryName || "Uncategorized"}

                      </td>

                      <td className="px-4 py-2">

                        {page.isPublished ? (

                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">

                            Yes

                          </span>

                        ) : (

                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">

                            No

                          </span>

                        )}

                      </td>

                      <td className="px-4 py-2">

                        {page.isHomepage ? (

                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">

                            Yes

                          </span>

                        ) : (

                          <span className="text-xs text-gray-400">No</span>

                        )}

                      </td>

                      <td className="px-4 py-2">

                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20">

                          {page.componentCount || 0}

                        </span>

                      </td>

                      <td className="px-4 py-2 text-gray-300">

                        {formatDate(page.createdAt)}

                      </td>

                      <td className="px-4 py-2">

                        <div className="flex items-center justify-end gap-2">

                          <button

                            onClick={() => handleView(page)}

                            className="p-2 rounded-md border border-white/20 hover:bg-white/10 text-white"

                            title="View"

                          >

                            <EyeIcon className="h-4 w-4" />

                          </button>

                          <button

                            onClick={() => handleEdit(page)}

                            className="p-2 rounded-md border border-white/20 hover:bg-white/10 text-white"

                            title="Edit"

                          >

                            <PencilIcon className="h-4 w-4" />

                          </button>

                          <button

                            onClick={() => handleDelete(page)}

                            className="p-2 rounded-md border border-white/20 hover:bg-white/10 text-red-400"

                            title="Delete"

                          >

                            <TrashIcon className="h-4 w-4" />

                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}



          {totalPages > 1 && (

            <div className="mt-4 flex items-center justify-between text-sm">

              <div className="text-gray-300">

                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}

                <span className="font-medium">

                  {Math.min(startIndex + ITEMS_PER_PAGE, sortedPages.length)}

                </span>{" "}

                of <span className="font-medium">{sortedPages.length}</span>

              </div>

              <div className="flex items-center gap-2">

                <button

                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}

                  disabled={currentPage === 1}

                  className="p-2 rounded-md border border-white/20 text-white disabled:opacity-50 disabled:text-gray-400"

                >

                  <ChevronLeftIcon className="h-4 w-4" />

                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {

                  let pageNum;

                  if (totalPages <= 5) pageNum = i + 1;

                  else if (currentPage <= 3) pageNum = i + 1;

                  else if (currentPage >= totalPages - 2)

                    pageNum = totalPages - 4 + i;

                  else pageNum = currentPage - 2 + i;

                  return (

                    <button

                      key={pageNum}

                      onClick={() => setCurrentPage(pageNum)}

                      className={`px-3 py-1 rounded-md border ${

                        currentPage === pageNum

                          ? "bg-white/20 text-white border-white/30"

                          : "border-white/20 text-white/80"

                      }`}

                    >

                      {pageNum}

                    </button>

                  );

                })}

                <button

                  onClick={() =>

                    setCurrentPage((p) => Math.min(totalPages, p + 1))

                  }

                  disabled={currentPage === totalPages}

                  className="p-2 rounded-md border border-white/20 text-white disabled:opacity-50 disabled:text-gray-400"

                >

                  <ChevronRightIcon className="h-4 w-4" />

                </button>

              </div>

            </div>

          )}

        </CardContent>

      </Card>



      {/* View Modal */}

      <ViewPageModal

        isOpen={showViewModal}

        onClose={() => setShowViewModal(false)}

        page={selectedPage}

      />



      {/* Edit Modal */}

      <EditPageModal

        isOpen={showEditModal}

        onClose={() => setShowEditModal(false)}

        page={selectedPage}

        onSave={fetchPages}

        showToast={showToast}

      />



      {/* Delete Confirmation Modal */}

      <Modal

        isOpen={showDeleteModal}

        onClose={() => setShowDeleteModal(false)}

        title="Delete Page"

      >

        <div className="space-y-4">

          <div className="flex items-center space-x-3">

            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />

            <div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white">

                Are you sure you want to delete this page?

              </h3>

              <p className="text-gray-600 dark:text-gray-400">

                This action cannot be undone. The page "{selectedPage?.title}"

                and all its data will be permanently removed.

              </p>

            </div>

          </div>

        </div>

        <ModalFooter>

          <Button

            variant="outline"

            onClick={() => setShowDeleteModal(false)}

            disabled={operationLoading}

          >

            Cancel

          </Button>

          <Button

            variant="destructive"

            onClick={confirmDelete}

            loading={operationLoading}

          >

            {operationLoading ? "Deleting..." : "Delete Page"}

          </Button>

        </ModalFooter>

      </Modal>



      {/* Toast Notification */}

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



// Enhanced View Page Modal Component (Live demo preview)

const ViewPageModal = ({ isOpen, onClose, page }) => {

  if (!page) return null;



  return (

    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">

      <div className="relative bg-white/10 border-b border-white/10 px-6 py-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-4">

            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow">

              <EyeIcon className="h-6 w-6 text-white" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-white">Page Preview</h2>

              <p className="text-sm text-gray-300">/{page.slug}</p>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <a

              href={`/${page.slug}`}

              target="_blank"

              rel="noreferrer"

              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white hover:text-white rounded-xl font-semibold text-sm transition-all duration-200"

            >

              Open in new tab

            </a>

            <button

              onClick={onClose}

              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white hover:text-white rounded-xl font-semibold text-sm transition-all duration-200"

            >

              Close

            </button>

          </div>

        </div>

      </div>



      <div className="p-0 bg-white/5">

        <div className="h-[80vh]">

          <iframe

            title="page-preview"

            src={`/${page.slug}`}

            className="w-full h-full border-0 bg-white"

          />

        </div>

      </div>

    </Modal>

  );

};



// Quick Create modal removed



export default PagesManagement;

