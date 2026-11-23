import React, { useState } from "react";
import api, { uploadForm } from "../services/legacy/api";

// Dummy modal for UI, replace with your modal implementation
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          margin: "10vh auto",
          padding: 24,
          borderRadius: 8,
          maxWidth: 500,
        }}
      >
        {children}
        <button onClick={onClose} style={{ marginTop: 16 }}>
          إغلاق
        </button>
      </div>
    </div>
  );
}

const defaultMediaData = (mediaType) => ({
  Role: mediaType === "video" ? "Video" : "Image",
  AlternateText: "",
  Caption: "",
  SortOrder: 1,
});

export default function MediaPicker({
  value,
  onChange,
  mediaType = "image",
  error,
}) {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [imageBlobUrls, setImageBlobUrls] = useState({});

  // Fetch image with authentication and create blob URL
  const fetchImageWithAuth = async (mediaId) => {
    if (imageBlobUrls[mediaId]) {
      return imageBlobUrls[mediaId]; // Return cached blob URL
    }

    try {
      const response = await api.get(`/Media/public/${mediaId}`, {
        responseType: 'blob'
      });
      const blobUrl = URL.createObjectURL(response.data);
      setImageBlobUrls(prev => ({ ...prev, [mediaId]: blobUrl }));
      return blobUrl;
    } catch (error) {
      console.error(`[MediaPicker] Failed to fetch image with auth:`, mediaId, error);
      setImageErrors(prev => ({ ...prev, [mediaId]: true }));
      return null;
    }
  };

  // Load images for the media list
  React.useEffect(() => {
    mediaList.forEach(media => {
      if (media.id && !imageBlobUrls[media.id] && !imageErrors[media.id]) {
        fetchImageWithAuth(media.id);
      }
    });
  }, [mediaList]);

  // Load image for selected media
  React.useEffect(() => {
    if (selectedMedia && !imageBlobUrls[selectedMedia] && !imageErrors[selectedMedia]) {
      fetchImageWithAuth(selectedMedia);
    }
  }, [selectedMedia]);

  // Cleanup blob URLs on unmount
  React.useEffect(() => {
    return () => {
      Object.values(imageBlobUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Error handler for images
  const handleImageError = (mediaId, e) => {
    console.error(`[MediaPicker] Failed to load image:`, {
      mediaId,
      url: getMediaUrl(mediaId),
      error: e
    });
    setImageErrors(prev => ({ ...prev, [mediaId]: true }));
  };

  // Helper function to get public media URL
  const getMediaUrl = (mediaId) => {
    if (!mediaId) return "";
    
    // Use blob URL if available (already fetched with auth)
    if (imageBlobUrls[mediaId]) {
      return imageBlobUrls[mediaId];
    }
    
    // If it's already a URL, return it as is
    if (typeof mediaId === 'string' && (mediaId.startsWith('http') || mediaId.startsWith('/'))) {
      // If it's already the public API URL, return as is
      if (mediaId.includes('/api/Media/public/')) {
        return mediaId;
      }
      // If it's another URL format, return as is
      if (mediaId.startsWith('http') || mediaId.startsWith('/media') || mediaId.startsWith('/images')) {
        return mediaId;
      }
    }
    // Otherwise treat it as an ID and construct the public URL
    return `/api/Media/public/${mediaId}`;
  };

  // Fetch existing media from API
  const fetchMedia = async () => {
    try {
      const response = await api.get("/Media");
      console.log('[MediaPicker] Fetched media list:', response.data);
      setMediaList(response.data || []);
    } catch (error) {
      console.error("[MediaPicker] Failed to fetch media:", error);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, []);

  const handlePick = (media) => {
    setSelectedMedia(media.id);
    setOpen(false);
    if (onChange) onChange(media.id);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(defaultMediaData(mediaType)).forEach(([k, v]) =>
      formData.append(k, v),
    );
    // Use unified media upload API endpoint with auth
    try {
      const response = await uploadForm(formData, "/Media/upload");
      console.log('[MediaPicker] Upload response:', response.data);
      setUploading(false);
      if (response.data && response.data.mediaId) {
        // Add the new media to the list immediately
        const newMedia = {
          id: response.data.mediaId,
          type: mediaType,
          role: mediaType === "video" ? "Video" : "Image",
          ...response.data
        };
        setMediaList(prev => [...prev, newMedia]);
        
        setSelectedMedia(response.data.mediaId);
        if (onChange) onChange(response.data.mediaId);
        
        // Refresh the media list to ensure consistency
        await fetchMedia();
        setOpen(false);
      }
    } catch (error) {
      console.error("[MediaPicker] Upload failed:", error);
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{ padding: "6px 12px", borderRadius: 6, background: "#eee" }}
        >
          اختر أو ارفع ميديا
        </button>
        {selectedMedia &&
          (mediaType === "image" ? (
            imageErrors[selectedMedia] ? (
              <div style={{
                width: 48,
                height: 48,
                background: '#f0f0f0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#999'
              }}>No Image</div>
            ) : (
              <img
                src={getMediaUrl(selectedMedia)}
                alt="preview"
                onError={(e) => handleImageError(selectedMedia, e)}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            )
          ) : (
            <video
              src={getMediaUrl(selectedMedia)}
              controls
              onError={(e) => console.error('[MediaPicker] Video load error:', e)}
              style={{ width: 80, height: 48, borderRadius: 4 }}
            />
          ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3>اختر ميديا موجودة</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {mediaList
            .filter((m) => m.type === mediaType)
            .map((media) => (
              <div
                key={media.id}
                style={{ cursor: "pointer" }}
                onClick={() => handlePick(media)}
              >
                {mediaType === "image" ? (
                  imageErrors[media.id] ? (
                    <div style={{
                      width: 80,
                      height: 80,
                      background: '#f0f0f0',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: '#999',
                      border: '1px solid #ddd'
                    }}>No Image</div>
                  ) : (
                    <img
                      src={getMediaUrl(media.id)}
                      alt="media"
                      onError={(e) => handleImageError(media.id, e)}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  )
                ) : (
                  <video
                    src={getMediaUrl(media.id)}
                    onError={(e) => console.error('[MediaPicker] Video load error:', media.id, e)}
                    style={{ width: 80, height: 80, borderRadius: 6 }}
                  />
                )}
              </div>
            ))}
        </div>
        <hr style={{ margin: "16px 0" }} />
        <h3>أو ارفع ميديا جديدة</h3>
        <input
          type="file"
          accept={mediaType === "image" ? "image/*" : "video/*"}
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <p>جاري الرفع...</p>}
      </Modal>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
