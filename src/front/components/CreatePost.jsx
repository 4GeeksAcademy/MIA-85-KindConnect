import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function CreatePost({
  open,
  onClose,
  onSubmit,                
  postSubmitFn,            
  category,                // "animals" | "food" | "honey-dos"
  defaultType = "seeking", // "seeking" | "sharing"
  heading = "Create a post"
}) {
  const { store } = useGlobalReducer();

  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]); // not uploaded yet; kept for UX/future
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // keep the selector in sync if the parent changes tabs
  useEffect(() => {
    if (open) setType(defaultType);
  }, [open, defaultType]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError("");
    setIsSubmitting(true);

    try {
      const bodyText = `${title.trim()}\n\n${desc.trim()}`.trim();

      const payload = {
        author:
          store.user?.username ||
          store.user?.email ||
          `${store.user?.first_name || ""} ${store.user?.last_name || ""}`.trim() ||
          "anon",
        body: bodyText,
        zip_code: zip.trim(),
        type,        // "seeking" | "sharing"
        category     // "animals" | "food" | "honey-dos"
      };

      const res = await fetch(`${store.API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${store.token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to create post");

      // support either callback prop name
      if (typeof onSubmit === "function") onSubmit(payload);
      if (typeof postSubmitFn === "function") postSubmitFn(payload);

      // reset + close
      setTitle("");
      setDesc("");
      setZip("");
      setFiles([]);
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong creating the post");
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const titlePlaceholder =
    type === "seeking"
      ? (category === "animals"
          ? "e.g., Need a pet carrier for a vet visit"
          : category === "food"
          ? "e.g., Looking for a warm meal tonight"
          : "e.g., Need help fixing a leaky faucet")
      : (category === "animals"
          ? "e.g., Offering a spare pet carrier this weekend"
          : category === "food"
          ? "e.g., Sharing extra homemade tacos"
          : "e.g., I can fix leaky faucets this weekend");

  return (
    <div className="cp" role="dialog" aria-modal="true" aria-labelledby="cpHeading" onClick={onClose}>
      <div className="cp__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cp__head">
          <h2 id="cpHeading" className="cp__title">{heading}</h2>
          <button className="cp__close" aria-label="Close" onClick={onClose}>✕</button>
        </div>

        {/* Type selector */}
        <div className="cp__seg" role="group" aria-label="Post type">
          <button
            type="button"
            className={`cp__segBtn ${type === "seeking" ? "is-active" : ""}`}
            onClick={() => setType("seeking")}
          >
            Seeking
          </button>
          <button
            type="button"
            className={`cp__segBtn ${type === "sharing" ? "is-active" : ""}`}
            onClick={() => setType("sharing")}
          >
            Sharing
          </button>
        </div>

        <form className="cp__form" onSubmit={handleSubmit}>
          <label htmlFor="cpInputTitle" className="cp__label">Title</label>
          <input
            id="cpInputTitle"
            className="cp__input"
            placeholder={titlePlaceholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="cpDesc" className="cp__label">Description</label>
          <textarea
            id="cpDesc"
            className="cp__textarea"
            rows="4"
            placeholder="Add helpful details…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label htmlFor="cpZip" className="cp__label">ZIP Code</label>
          <input
            id="cpZip"
            className="cp__input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            placeholder="e.g., 75701"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />

          <label htmlFor="cpFiles" className="cp__label">Add photo or video</label>
          <input
            id="cpFiles"
            className="cp__file"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          {error && <p className="cp__error">{error}</p>}

          <div className="cp__actions">
            <button type="button" className="cp__btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="cp__btn cp__btn--primary" disabled={isSubmitting}>
              {isSubmitting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
