import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  getPublicSettings,
  createSetting,
  updateSetting,
} from "../services/settingsApi";

const SETTING_KEY = "footer_quick_links";

const emptyLink = () => ({ name: "", url: "" });

const QuickLinksSettings = () => {
  const [links, setLinks] = useState([]);
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPublicSettings();
      if (res.success && Array.isArray(res.data)) {
        const existing = res.data.find((s) => s.key === SETTING_KEY);
        if (existing) {
          setSettingId(existing.id);
          try {
            const parsed = JSON.parse(existing.value);
            setLinks(Array.isArray(parsed) ? parsed : []);
          } catch {
            setLinks([]);
          }
        } else {
          setSettingId(null);
          setLinks([]);
        }
      }
    } catch {
      setLinks([]);
    } finally {
      setLoading(false);
      setDirty(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAdd = () => {
    setLinks((prev) => [...prev, emptyLink()]);
    setDirty(true);
  };

  const handleRemove = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index, field, value) => {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    );
    setDirty(true);
  };

  const handleSave = async () => {
    // Validate — every entry needs both name and url
    const invalid = links.some(
      (l) => !l.name?.trim() || !l.url?.trim()
    );
    if (invalid) {
      toast.error("All links must have both a name and a URL.");
      return;
    }

    setSaving(true);
    try {
      const value = JSON.stringify(links);
      const payload = {
        key: SETTING_KEY,
        value,
        description: "Footer quick links (JSON array of {name, url})",
        category: "footer",
        isPublic: true,
        dataType: "json",
      };

      let res;
      if (settingId) {
        res = await updateSetting({ ...payload, id: settingId });
      } else {
        res = await createSetting(payload);
      }

      if (res.success) {
        if (res.data?.id) setSettingId(res.data.id);
        setDirty(false);
        toast.success("Quick links saved successfully");
      } else {
        toast.error(res.message || "Failed to save quick links");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 h-40 text-[var(--adm-text-muted)]">
        <ArrowPathIcon className="w-6 h-6 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--adm-text)]">
            Quick links
          </h2>
          <p className="mt-1 text-sm text-[var(--adm-text-muted)]">
            Manage the quick links displayed in the footer. Each link needs a
            display name and a URL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchLinks}
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-[var(--adm-text-muted)] transition-colors hover:bg-[var(--adm-surface-2)] hover:text-[var(--adm-text)]"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="flex h-9 items-center gap-2 rounded-lg border border-[var(--adm-border-strong)] bg-[var(--adm-surface-2)] px-3 text-sm text-[var(--adm-text)] transition-colors hover:bg-[var(--adm-surface-hover)]"
          >
            <PlusIcon className="w-4 h-4" />
            Add Link
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="flex h-9 items-center gap-2 rounded-lg bg-[var(--adm-accent)] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[var(--adm-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Links list */}
      <div className="bg-[var(--adm-surface)] border border-[var(--adm-border)] shadow-[var(--adm-shadow)] rounded-xl p-6 space-y-4">
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-[var(--adm-text-muted)] gap-3">
            <LinkIcon className="w-10 h-10 opacity-40" />
            <p className="text-sm">No quick links yet. Click "Add Link" to get started.</p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_1fr_40px] gap-3 text-xs font-semibold text-[var(--adm-text-muted)] uppercase tracking-wide pb-1 border-b border-[var(--adm-border)]">
              <span>Display Name</span>
              <span>URL</span>
              <span />
            </div>

            <AnimatePresence initial={false}>
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-[1fr_1fr_40px] gap-3 items-center"
                >
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    placeholder="e.g. Home"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--adm-surface)] border border-[var(--adm-border-strong)] text-[var(--adm-text)] placeholder-[var(--adm-text-subtle)] text-sm focus:outline-none focus:border-[var(--adm-accent)] transition-colors"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleChange(index, "url", e.target.value)}
                    placeholder="e.g. /about or https://..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--adm-surface)] border border-[var(--adm-border-strong)] text-[var(--adm-text)] placeholder-[var(--adm-text-subtle)] text-sm focus:outline-none focus:border-[var(--adm-accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    aria-label="Remove link"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}

        {/* Bottom add button when list has items */}
        {links.length > 0 && (
          <button
            type="button"
            onClick={handleAdd}
            className="w-full mt-2 py-2 rounded-lg border border-dashed border-[var(--adm-border-strong)] text-[var(--adm-text-muted)] hover:border-[var(--adm-accent)] hover:text-[var(--adm-accent-text)] transition-colors text-sm flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add another link
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickLinksSettings;
