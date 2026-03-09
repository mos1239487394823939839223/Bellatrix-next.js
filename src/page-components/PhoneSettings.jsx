import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  getPublicSettings,
  createSetting,
  updateSetting,
} from "../services/settingsApi";

const SETTING_KEY = "footer_phones";

const FLAGS = [
  { flag: "", label: "No flag" },
  { flag: "🇺🇸", label: "🇺🇸 United States" },
  { flag: "🇬🇧", label: "🇬🇧 United Kingdom" },
  { flag: "🇨🇦", label: "🇨🇦 Canada" },
  { flag: "🇦🇺", label: "🇦🇺 Australia" },
  { flag: "🇦🇪", label: "🇦🇪 UAE" },
  { flag: "🇸🇦", label: "🇸🇦 Saudi Arabia" },
  { flag: "🇪🇬", label: "🇪🇬 Egypt" },
  { flag: "🇩🇪", label: "🇩🇪 Germany" },
  { flag: "🇫🇷", label: "🇫🇷 France" },
  { flag: "🇮🇹", label: "🇮🇹 Italy" },
  { flag: "🇪🇸", label: "🇪🇸 Spain" },
  { flag: "🇳🇱", label: "🇳🇱 Netherlands" },
  { flag: "🇸🇪", label: "🇸🇪 Sweden" },
  { flag: "🇨🇭", label: "🇨🇭 Switzerland" },
  { flag: "🇵🇱", label: "🇵🇱 Poland" },
  { flag: "🇹🇷", label: "🇹🇷 Turkey" },
  { flag: "🇷🇺", label: "🇷🇺 Russia" },
  { flag: "🇮🇳", label: "🇮🇳 India" },
  { flag: "🇨🇳", label: "🇨🇳 China" },
  { flag: "🇯🇵", label: "🇯🇵 Japan" },
  { flag: "🇰🇷", label: "🇰🇷 South Korea" },
  { flag: "🇸🇬", label: "🇸🇬 Singapore" },
  { flag: "🇭🇰", label: "🇭🇰 Hong Kong" },
  { flag: "🇧🇷", label: "🇧🇷 Brazil" },
  { flag: "🇲🇽", label: "🇲🇽 Mexico" },
  { flag: "🇦🇷", label: "🇦🇷 Argentina" },
  { flag: "🇳🇬", label: "🇳🇬 Nigeria" },
  { flag: "🇿🇦", label: "🇿🇦 South Africa" },
  { flag: "🇵🇰", label: "🇵🇰 Pakistan" },
  { flag: "🇧🇩", label: "🇧🇩 Bangladesh" },
  { flag: "🇮🇩", label: "🇮🇩 Indonesia" },
  { flag: "🇵🇭", label: "🇵🇭 Philippines" },
  { flag: "🇲🇾", label: "🇲🇾 Malaysia" },
  { flag: "🇹🇭", label: "🇹🇭 Thailand" },
  { flag: "🇻🇳", label: "🇻🇳 Vietnam" },
  { flag: "🇯🇴", label: "🇯🇴 Jordan" },
  { flag: "🇱🇧", label: "🇱🇧 Lebanon" },
  { flag: "🇰🇼", label: "🇰🇼 Kuwait" },
  { flag: "🇶🇦", label: "🇶🇦 Qatar" },
  { flag: "🇴🇲", label: "🇴🇲 Oman" },
  { flag: "🇧🇭", label: "🇧🇭 Bahrain" },
  { flag: "🇮🇶", label: "🇮🇶 Iraq" },
  { flag: "🇮🇷", label: "🇮🇷 Iran" },
  { flag: "🇲🇦", label: "🇲🇦 Morocco" },
  { flag: "🇹🇳", label: "🇹🇳 Tunisia" },
  { flag: "🇩🇿", label: "🇩🇿 Algeria" },
  { flag: "🇱🇾", label: "🇱🇾 Libya" },
  { flag: "🇸🇩", label: "🇸🇩 Sudan" },
];

const emptyPhone = () => ({ flag: "", number: "" });

const PhoneSettings = () => {
  const [phones, setPhones] = useState([]);
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fetchPhones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPublicSettings();
      if (res.success && Array.isArray(res.data)) {
        const existing = res.data.find((s) => s.key === SETTING_KEY);
        if (existing) {
          setSettingId(existing.id);
          try {
            const parsed = JSON.parse(existing.value);
            setPhones(Array.isArray(parsed) ? parsed : []);
          } catch {
            setPhones([]);
          }
        } else {
          setSettingId(null);
          setPhones([]);
        }
      }
    } catch {
      setPhones([]);
    } finally {
      setLoading(false);
      setDirty(false);
    }
  }, []);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  const handleAdd = () => {
    setPhones((prev) => [...prev, emptyPhone()]);
    setDirty(true);
  };

  const handleRemove = (index) => {
    setPhones((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index, field, value) => {
    setPhones((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
    setDirty(true);
  };

  const handleSave = async () => {
    const invalid = phones.some((p) => !p.number?.trim());
    if (invalid) {
      toast.error("All entries must have a phone number.");
      return;
    }

    setSaving(true);
    try {
      const value = JSON.stringify(phones);
      const payload = {
        key: SETTING_KEY,
        value,
        description: "Footer phone numbers with country flags (JSON array of {flag, number})",
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
        toast.success("Phone numbers saved successfully");
      } else {
        toast.error(res.message || "Failed to save phone numbers");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 h-40 text-white">
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
          <h2 className="text-2xl font-bold text-[var(--color-text-inverse)]">
            Phone Numbers
          </h2>
          <p className="text-white mt-1 text-sm">
            Manage the phone numbers displayed in the footer. Optionally add a
            country flag to each number.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchPhones}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-white-20)] text-[var(--color-text-inverse)] hover:bg-[var(--color-white-10)] transition-colors text-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-white-10)] border border-[var(--color-white-20)] text-[var(--color-text-inverse)] hover:bg-[var(--color-white-20)] transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Number
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Phone list */}
      <div className="bg-[var(--color-white-10)] border border-[var(--color-white-20)] rounded-xl p-6 space-y-4">
        {phones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-white gap-3">
            <PhoneIcon className="w-10 h-10 opacity-40" />
            <p className="text-sm">
              No phone numbers yet. Click "Add Number" to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-[180px_1fr_40px] gap-3 text-xs font-semibold text-white uppercase tracking-wide pb-1 border-b border-[var(--color-white-10)]">
              <span>Flag</span>
              <span>Phone Number</span>
              <span />
            </div>

            <AnimatePresence initial={false}>
              {phones.map((phone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-[180px_1fr_40px] gap-3 items-center"
                >
                  {/* Flag selector */}
                  <select
                    value={phone.flag}
                    onChange={(e) => handleChange(index, "flag", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-white-5)] border border-[var(--color-white-20)] text-[var(--color-text-inverse)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none cursor-pointer"
                  >
                    {FLAGS.map((f) => (
                      <option key={f.flag} value={f.flag}>
                        {f.label}
                      </option>
                    ))}
                  </select>

                  {/* Phone number input */}
                  <input
                    type="text"
                    value={phone.number}
                    onChange={(e) =>
                      handleChange(index, "number", e.target.value)
                    }
                    placeholder="e.g. +1 (555) 123-4567"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-white-5)] border border-[var(--color-white-20)] text-[var(--color-text-inverse)] placeholder-[var(--color-ww-100)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    aria-label="Remove phone number"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </>
        )}

        {phones.length > 0 && (
          <button
            type="button"
            onClick={handleAdd}
            className="w-full mt-2 py-2 rounded-lg border border-dashed border-[var(--color-white-20)] text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-sm flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add another number
          </button>
        )}
      </div>
    </div>
  );
};

export default PhoneSettings;
