'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import api from "../../../lib/api";

const CategorySelector = ({ value, onChange }) => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/Categories");
        const list = Array.isArray(res.data) ? res.data : [];

        setCategories(list);
      } catch (e) {
        setError(e.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-white/80 text-sm">Loading categories...</div>;
  }
  if (error) {
    return <div className="text-red-300 text-sm">{error}</div>;
  }
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 bg-[var(--color-brand-dark-navy)] border-2 border-[var(--color-primary)] rounded-2xl p-8 text-center mt-10 shadow-xl max-w-2xl mx-auto animate-fade-slide">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-[var(--color-primary-light)] mb-1">
            No Categories Found
          </h2>
          <p className="text-lg text-[var(--color-ww-100)] font-medium mb-2">
            You must create at least one category before you can create a new
            page.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/categories")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-[var(--color-text-inverse)] font-bold rounded-xl shadow hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary)] hover:text-[var(--color-text-primary)] transition-all duration-200 text-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`text-left p-4 rounded-lg border transition ${
            value === c.id
              ? "border-[var(--color-primary-light)] bg-[var(--color-primary)]/10"
              : "border-[var(--color-white-10)] hover:border-[var(--color-white-20)] bg-[var(--color-white)]/5"
          }`}
        >
          <div className="text-[var(--color-text-inverse)] font-semibold">
            {c.name}
          </div>
          {c.description && (
            <div className="text-[var(--color-text-inverse)]/70 text-sm mt-1">
              {c.description}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
