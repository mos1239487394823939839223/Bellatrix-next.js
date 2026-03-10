import { useState, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import MediaPicker from "../../../UI/MediaPicker";
import { DEFAULT_SOLUTIONS } from "../../../SolutionsGallery";

const DEFAULT_CARD = {
  title: "",
  subtitle: "",
  category: "",
  description: "",
  image: "",
  href: "/",
  accentColor: "#6366f1",
  featured: false,
  features: [],
};

const ACCENT_PRESETS = [
  { label: "Indigo",  value: "#6366f1" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Green",   value: "#22c55e" },
  { label: "Orange",  value: "#f97316" },
  { label: "Cyan",    value: "#06b6d4" },
  { label: "Amber",   value: "#eab308" },
  { label: "Red",     value: "#ef4444" },
  { label: "Pink",    value: "#ec4899" },
];

const safeParseContentJson = (contentJson, fallback = {}) => {
  if (!contentJson) return fallback;
  if (typeof contentJson === "object") return contentJson;
  try { return JSON.parse(contentJson); } catch { return fallback; }
};

const inputCls =
  "block w-full rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 px-3 py-2 text-sm outline-none transition-colors";
const labelCls = "block text-xs font-medium text-gray-400 mb-1";

const SolutionsGalleryConfig = ({ component, index, onUpdate }) => {
  const [editingIndex, setEditingIndex]     = useState(null);
  const [newFeatureText, setNewFeatureText]   = useState("");
  const [imagePickerIndex, setImagePickerIndex] = useState(null);

  const rawData = safeParseContentJson(component.contentJson, {
    title: "",
    subtitle: "",
    solutions: [],
  });

  // When the component was just added (placeholder) or has no configured cards yet,
  // pre-populate with the live site's default cards so the user can edit them directly.
  const isPlaceholder =
    rawData._isPlaceholder ||
    !Array.isArray(rawData.solutions) ||
    rawData.solutions.length === 0;

  const data = isPlaceholder
    ? {
        title: rawData.title && !rawData._isPlaceholder ? rawData.title : "Powerful Solutions, Built for Your Business",
        subtitle: rawData.subtitle && !rawData._isPlaceholder ? rawData.subtitle : "From ERP to industry-specific platforms — discover how Bellatrix drives operational excellence across every function.",
        solutions: DEFAULT_SOLUTIONS,
      }
    : rawData;

  const solutions = Array.isArray(data.solutions) ? data.solutions : [];

  // Flush default data into contentJson on first render so live preview shows the real cards
  useEffect(() => {
    if (isPlaceholder) {
      onUpdate(index, "contentJson", JSON.stringify(data, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── helpers ── */
  const save = (updated) =>
    onUpdate(index, "contentJson", JSON.stringify(updated, null, 2));

  const updateTopField = (field, value) =>
    save({ ...data, [field]: value });

  const updateCard = (cardIndex, field, value) => {
    const updated = solutions.map((s, i) =>
      i === cardIndex ? { ...s, [field]: value } : s
    );
    save({ ...data, solutions: updated });
  };

  const addCard = () => {
    const updated = [...solutions, { ...DEFAULT_CARD }];
    save({ ...data, solutions: updated });
    setEditingIndex(updated.length - 1);
  };

  const deleteCard = (cardIndex) => {
    const updated = solutions.filter((_, i) => i !== cardIndex);
    save({ ...data, solutions: updated });
    if (editingIndex === cardIndex) setEditingIndex(null);
    else if (editingIndex !== null && editingIndex > cardIndex)
      setEditingIndex(editingIndex - 1);
  };

  const addFeature = (cardIndex) => {
    const trimmed = newFeatureText.trim();
    if (!trimmed) return;
    const card    = solutions[cardIndex];
    const updated = [...(Array.isArray(card.features) ? card.features : []), trimmed];
    updateCard(cardIndex, "features", updated);
    setNewFeatureText("");
  };

  const removeFeature = (cardIndex, featureIndex) => {
    const updated = (solutions[cardIndex].features || []).filter(
      (_, i) => i !== featureIndex
    );
    updateCard(cardIndex, "features", updated);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-300">
          Content Configuration
        </label>
        <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 rounded-full">
          Solutions Gallery
        </span>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 space-y-5">

        {/* ── Section header ── */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Section Header
          </p>
          <div>
            <label className={labelCls}>Section Title</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateTopField("title", e.target.value)}
              placeholder="Powerful Solutions, Built for Your Business"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Section Subtitle</label>
            <textarea
              rows={2}
              value={data.subtitle || ""}
              onChange={(e) => updateTopField("subtitle", e.target.value)}
              placeholder="From ERP to industry-specific platforms…"
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className={labelCls}>CTA Button Text</label>
            <input
              type="text"
              value={data.ctaButtonText || ""}
              onChange={(e) => updateTopField("ctaButtonText", e.target.value)}
              placeholder="Talk to an Expert"
              className={inputCls}
            />
            <p className="text-[10px] text-gray-600 mt-1">
              The button at the bottom of the section that opens the contact form.
            </p>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* ── Cards list ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Solution Cards
              <span className="ml-1.5 text-gray-600">({solutions.length})</span>
            </p>
            <button
              type="button"
              onClick={addCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Add Card
            </button>
          </div>

          {solutions.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-sm border border-dashed border-white/10 rounded-xl">
              No solution cards yet.
              <br />
              <button
                type="button"
                onClick={addCard}
                className="mt-3 text-blue-400 hover:text-blue-300 text-xs underline"
              >
                Add your first card
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {solutions.map((card, cardIndex) => {
                const isEditing = editingIndex === cardIndex;
                const accent    = card.accentColor || "#6366f1";

                return (
                  <div key={cardIndex}>
                    {/* ── Card thumbnail row ── */}
                    <div
                      className={`relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer select-none ${
                        isEditing
                          ? "border-blue-400/60 ring-1 ring-blue-400/20"
                          : "border-white/10 hover:border-white/25"
                      }`}
                      style={{ background: `${accent}0d` }}
                      onClick={() =>
                        setEditingIndex(isEditing ? null : cardIndex)
                      }
                    >
                      {/* Accent top line */}
                      <div
                        className="h-[3px]"
                        style={{ background: `linear-gradient(90deg,${accent},transparent)` }}
                      />

                      <div className="flex items-center gap-3 px-3 py-2.5">
                        {/* Thumbnail */}
                        <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">
                              🖼️
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate leading-tight">
                            {card.title || (
                              <span className="text-gray-500 italic">Untitled card</span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {card.category && (
                              <span
                                className="text-[10px] px-1.5 py-px rounded-full font-medium"
                                style={{
                                  background: `${accent}22`,
                                  color: accent,
                                }}
                              >
                                {card.category}
                              </span>
                            )}
                            {card.featured && (
                              <span className="text-[10px] px-1.5 py-px rounded-full bg-yellow-500/20 text-yellow-300 font-medium">
                                Featured
                              </span>
                            )}
                            <span className="text-[10px] text-gray-600 truncate">
                              {card.href || "/"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="flex items-center gap-1 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setEditingIndex(isEditing ? null : cardIndex)
                            }
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCard(cardIndex)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                          {isEditing ? (
                            <ChevronUpIcon className="h-3.5 w-3.5 text-blue-400 ml-0.5" />
                          ) : (
                            <ChevronDownIcon className="h-3.5 w-3.5 text-gray-600 ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── Inline editor ── */}
                    {isEditing && (
                      <div className="mt-1.5 rounded-xl border border-blue-400/30 bg-slate-900/70 backdrop-blur-sm p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                            Editing: {card.title || `Card ${cardIndex + 1}`}
                          </p>
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Image field */}
                        <div>
                          <label className={labelCls}>Card Image</label>
                          {/* Preview */}
                          {card.image && (
                            <div className="mb-2 w-full h-28 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                              <img
                                src={card.image}
                                alt="preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            </div>
                          )}
                          {/* URL text input */}
                          <input
                            type="text"
                            value={card.image || ""}
                            onChange={(e) =>
                              updateCard(cardIndex, "image", e.target.value)
                            }
                            placeholder="/images/solution.jpg or https://…"
                            className={`${inputCls} mb-2`}
                          />
                          {/* Browse button */}
                          <button
                            type="button"
                            onClick={() => setImagePickerIndex(cardIndex)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-gray-300 border border-white/20 transition-colors"
                          >
                            <PhotoIcon className="h-3.5 w-3.5" />
                            Browse Media Library
                          </button>
                        </div>

                        {/* Title + Subtitle */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Title *</label>
                            <input
                              type="text"
                              value={card.title || ""}
                              onChange={(e) =>
                                updateCard(cardIndex, "title", e.target.value)
                              }
                              placeholder="NetSuite ERP"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Subtitle</label>
                            <input
                              type="text"
                              value={card.subtitle || ""}
                              onChange={(e) =>
                                updateCard(cardIndex, "subtitle", e.target.value)
                              }
                              placeholder="Implementation & Customization"
                              className={inputCls}
                            />
                          </div>
                        </div>

                        {/* Category + Link */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Category</label>
                            <input
                              type="text"
                              value={card.category || ""}
                              onChange={(e) =>
                                updateCard(cardIndex, "category", e.target.value)
                              }
                              placeholder="ERP"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Link URL</label>
                            <input
                              type="text"
                              value={card.href || ""}
                              onChange={(e) =>
                                updateCard(cardIndex, "href", e.target.value)
                              }
                              placeholder="/netsuite"
                              className={inputCls}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className={labelCls}>Description</label>
                          <textarea
                            rows={3}
                            value={card.description || ""}
                            onChange={(e) =>
                              updateCard(cardIndex, "description", e.target.value)
                            }
                            placeholder="Brief description of this solution..."
                            className={`${inputCls} resize-none`}
                          />
                        </div>

                        {/* Accent color */}
                        <div>
                          <label className={labelCls}>Accent Color</label>
                          <div className="flex flex-wrap items-center gap-2">
                            {ACCENT_PRESETS.map((preset) => (
                              <button
                                key={preset.value}
                                type="button"
                                onClick={() =>
                                  updateCard(cardIndex, "accentColor", preset.value)
                                }
                                className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                                style={{
                                  background: preset.value,
                                  borderColor:
                                    card.accentColor === preset.value
                                      ? "white"
                                      : "transparent",
                                }}
                                title={preset.label}
                              />
                            ))}
                            <input
                              type="color"
                              value={card.accentColor || "#6366f1"}
                              onChange={(e) =>
                                updateCard(cardIndex, "accentColor", e.target.value)
                              }
                              className="w-7 h-7 rounded cursor-pointer bg-transparent border border-white/20"
                              title="Custom color"
                            />
                            <span className="text-xs text-gray-500 font-mono">
                              {card.accentColor || "#6366f1"}
                            </span>
                          </div>
                        </div>

                        {/* Featured toggle */}
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() =>
                            updateCard(cardIndex, "featured", !card.featured)
                          }
                        >
                          <button
                            type="button"
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                              card.featured ? "bg-blue-500" : "bg-white/20"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                                card.featured ? "translate-x-5" : ""
                              }`}
                            />
                          </button>
                          <div>
                            <p className="text-sm text-gray-300 leading-none">
                              Featured card
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Spans 2 columns on desktop
                            </p>
                          </div>
                        </div>

                        {/* Feature chips */}
                        <div>
                          <label className={labelCls}>
                            Feature Chips{" "}
                            <span className="text-gray-600">
                              ({(card.features || []).length})
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
                            {(card.features || []).map((f, fi) => (
                              <span
                                key={fi}
                                className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/10"
                              >
                                {f}
                                <button
                                  type="button"
                                  onClick={() => removeFeature(cardIndex, fi)}
                                  className="text-gray-500 hover:text-red-400 transition-colors ml-0.5"
                                >
                                  <XMarkIcon className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                            {(card.features || []).length === 0 && (
                              <span className="text-xs text-gray-600 italic">
                                No features yet
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFeatureText}
                              onChange={(e) =>
                                setNewFeatureText(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addFeature(cardIndex);
                                }
                              }}
                              placeholder='e.g. "Financial Management"'
                              className={`${inputCls} flex-1`}
                            />
                            <button
                              type="button"
                              onClick={() => addFeature(cardIndex)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 transition-colors whitespace-nowrap"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Media picker modal for card images */}
      <MediaPicker
        isOpen={imagePickerIndex !== null}
        onClose={() => setImagePickerIndex(null)}
        onSelect={(url) => {
          if (imagePickerIndex !== null)
            updateCard(imagePickerIndex, "image", url);
          setImagePickerIndex(null);
        }}
        accept="image"
        maxSelection={1}
      />
    </div>
  );
};

export default SolutionsGalleryConfig;
