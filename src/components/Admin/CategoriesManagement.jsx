'use client'
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { services, validate, schemas } from "../../services";
import {
  Btn,
  ConfirmDialog,
  Dialog,
  EmptyState,
  Field,
  IconBtn,
  PageHeader,
  Panel,
  SearchInput,
  Spinner,
  inputClass,
} from "./ui";

const extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const EMPTY_FORM = { name: "", description: "", sortOrder: 0 };

const isDuplicateError = (message = "") =>
  message.includes("duplicate") || message.includes("unique");

function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  // Add / edit share one dialog; editId === null means "add"
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      setCategories(extractList(await services.categories.list()));
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced server-side search
  useEffect(() => {
    if (search.trim() === "") {
      fetchCategories();
      return;
    }
    const handler = setTimeout(async () => {
      setSearching(true);
      try {
        setCategories(extractList(await services.categories.search(search)));
      } catch {
        setCategories([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = async (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name || "", description: cat.description || "", sortOrder: cat.sortOrder || 0 });
    setFormOpen(true);
    setFormLoading(true);
    try {
      const data = await services.categories.getById(cat.id);
      if (data) {
        setForm({
          name: data.name || "",
          description: data.description || "",
          sortOrder: data.sortOrder || 0,
        });
      }
    } catch {
      toast.error("Failed to load category data");
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const { valid, errors } = validate(schemas.categorySchema, { ...form, name });
    if (!valid) {
      toast.error(Object.values(errors)[0]);
      return;
    }
    const duplicate = categories.some(
      (cat) => cat.id !== editId && cat.name.toLowerCase().trim() === name.toLowerCase()
    );
    if (duplicate) {
      toast.error(`Category "${name}" already exists. Please choose a different name.`);
      return;
    }

    setSaving(true);
    const isEdit = editId !== null;
    try {
      await services.categories.save({
        ...(isEdit ? { id: editId } : {}),
        ...form,
        name,
        sortOrder: Number(form.sortOrder) || 0,
      });
      toast.success(isEdit ? "Category updated successfully" : "Category added successfully");
      setFormOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(
        isDuplicateError(error.message)
          ? `Category "${name}" already exists. Please choose a different name.`
          : error.message || `Failed to ${isEdit ? "update" : "add"} category. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await services.categories.remove(deleteTarget.id);
      toast.success("Category deleted successfully");
      setDeleteTarget(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const busy = loading || searching;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Categories group your pages and shape the site navigation."
        actions={
          <Btn variant="primary" icon={PlusIcon} onClick={openAdd}>
            New category
          </Btn>
        }
      />

      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--adm-border)] p-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search categories…" className="w-full sm:w-72" />
          {!busy && (
            <span className="ml-auto text-xs text-[var(--adm-text-muted)]">
              {categories.length} {categories.length === 1 ? "category" : "categories"}
            </span>
          )}
        </div>

        {busy ? (
          <Spinner label={searching ? "Searching…" : "Loading categories…"} />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={ViewColumnsIcon}
            title={search ? "No categories match your search" : "No categories yet"}
            description={search ? "Try a different keyword." : "Create a category to start grouping pages."}
            action={!search && <Btn variant="primary" icon={PlusIcon} onClick={openAdd}>New category</Btn>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[var(--adm-border)] text-left text-xs text-[var(--adm-text-subtle)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Description</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">ID</th>
                  <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--adm-border)]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-[var(--adm-surface-2)]/50">
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => openEdit(cat)} className="font-medium text-[var(--adm-text)] hover:text-[var(--adm-accent-text)]">
                        {cat.name}
                      </button>
                      {cat.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-[var(--adm-text-subtle)] md:hidden">{cat.description}</p>
                      )}
                    </td>
                    <td className="hidden max-w-md px-4 py-3 text-[var(--adm-text-muted)] md:table-cell">
                      <span className="line-clamp-2">{cat.description || <span className="text-[var(--adm-text-subtle)]">—</span>}</span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[var(--adm-text-muted)]">{cat.sortOrder}</td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-[var(--adm-text-subtle)] sm:table-cell">#{cat.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-0.5">
                        <IconBtn icon={PencilIcon} label={`Edit ${cat.name}`} onClick={() => openEdit(cat)} />
                        <IconBtn icon={TrashIcon} label={`Delete ${cat.name}`} variant="danger" onClick={() => setDeleteTarget(cat)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Dialog
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        title={editId !== null ? "Edit category" : "New category"}
        description={editId !== null ? "Changes apply to the site navigation immediately." : "Add a category to group related pages."}
      >
        {formLoading ? (
          <Spinner label="Loading…" />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name" htmlFor="cat-name">
              <input
                id="cat-name"
                className={inputClass}
                placeholder="e.g. Services"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                autoFocus
              />
            </Field>
            <Field label="Description" htmlFor="cat-desc">
              <textarea
                id="cat-desc"
                rows={3}
                className={inputClass}
                placeholder="Optional short description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
            <Field label="Sort order" htmlFor="cat-order" hint="Lower numbers appear first in the navigation.">
              <input
                id="cat-order"
                type="number"
                className={`${inputClass} max-w-[8rem]`}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </Field>
            <div className="flex justify-end gap-2 border-t border-[var(--adm-border)] pt-4">
              <Btn variant="secondary" onClick={() => setFormOpen(false)} disabled={saving}>
                Cancel
              </Btn>
              <Btn type="submit" variant="primary" loading={saving}>
                {editId !== null ? "Save changes" : "Create category"}
              </Btn>
            </div>
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This permanently removes the category. This can't be undone."
        confirmLabel="Delete category"
      />
    </div>
  );
}

export default CategoriesManagement;
