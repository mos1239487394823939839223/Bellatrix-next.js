'use client'
import { useState, useEffect } from "react";
import { PhotoIcon, ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import MediaPicker from "../UI/MediaPicker";
import { DEFAULT_SOLUTIONS } from "../SolutionsGallery";

const STORAGE_KEY = "sg_image_overrides";

export default function SolutionsGalleryManager() {
  const [images, setImages] = useState({});
  const [pickerOpenId, setPickerOpenId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setImages(JSON.parse(stored));
    } catch {/* ignore */}
  }, []);

  const handleUrlChange = (id, url) => {
    setImages((prev) => ({ ...prev, [id]: url }));
    setSaved(false);
  };

  const handlePickerSelect = (id, url) => {
    setImages((prev) => ({ ...prev, [id]: url }));
    setSaved(false);
    setPickerOpenId(null);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = (id) => {
    setImages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solutions Gallery Images</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the image for each solution card. Changes are saved to browser storage.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: saved ? "#22c55e" : "#6366f1" }}
        >
          {saved ? (
            <>
              <CheckCircleIcon className="w-4 h-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {DEFAULT_SOLUTIONS.map((solution) => {
          const currentImage = images[solution.id] ?? solution.image;
          return (
            <div
              key={solution.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm"
            >
              {/* Image preview */}
              <div className="relative h-44 bg-gray-100 dark:bg-gray-900">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <PhotoIcon className="w-12 h-12" />
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-end p-3"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                      {solution.category}
                    </span>
                    <p className="text-white font-semibold text-sm leading-tight">{solution.title}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 space-y-3">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Image URL
                </label>
                <input
                  type="text"
                  value={currentImage}
                  onChange={(e) => handleUrlChange(solution.id, e.target.value)}
                  placeholder="/images/my-image.jpg"
                  className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setPickerOpenId(solution.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Choose from Media
                  </button>
                  {images[solution.id] && (
                    <button
                      onClick={() => handleReset(solution.id)}
                      title="Reset to default"
                      className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:text-red-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MediaPicker for whichever card triggered it */}
      <MediaPicker
        isOpen={pickerOpenId !== null}
        onClose={() => setPickerOpenId(null)}
        onSelect={(url) => handlePickerSelect(pickerOpenId, url)}
        accept="image"
        maxSelection={1}
      />
    </div>
  );
}
