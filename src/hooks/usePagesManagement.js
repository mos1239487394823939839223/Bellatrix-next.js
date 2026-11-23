import { useState, useEffect, useCallback } from "react";
import pagesAPI from "../services/legacy/pagesAPI";

const ITEMS_PER_PAGE = 10;

export const usePagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pagesAPI.getPages();
      
      // Fetch full page data to get component counts
      const pagesWithComponentCounts = await Promise.all(
        data.map(async (page) => {
          try {
            const fullPage = await pagesAPI.getPageById(page.id);
            const componentCount = fullPage?.components?.length || 
                                   fullPage?.pageComponents?.length || 
                                   fullPage?.Components?.length ||
                                   fullPage?.PageComponents?.length || 0;
            return { ...page, componentCount };
          } catch {
            return { ...page, componentCount: 0 };
          }
        })
      );
      
      setPages(pagesWithComponentCounts);
    } catch (err) {
      setError(err.message);
      showToast("Error fetching pages: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

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
      if (key === "categoryName")
        return (p.categoryName || "").toLowerCase();
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

  return {
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
    setToast,
    filteredPages: sortedPages,
    paginatedPages,
    totalPages,
    startIndex,
    itemsPerPage: ITEMS_PER_PAGE,
    fetchPages,
    showToast,
    handleToggleSort,
    handleToggleSelect,
    handleToggleSelectAll,
  };
};

