import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // make sure this is set

export default function CreatePost({
  open,
  onClose,
  onSubmit,
  defaultType = "wanted",
}) {
  const { store } = useGlobalReducer();

  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setType(defaultType), [defaultType]);
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // build what your Flask API expects
      const bodyText = `${title.trim()}\n\n${desc.trim()}`.trim();
      const payload = {
        author:
          store.user?.username ||
          store.user?.email ||
          `${store.user?.first_name || ""} ${store.user?.last_name || ""}`.trim() ||
          "anon",
        body: bodyText,
        zip_code: zip.trim(),
        // backend ignores extra keys, so we can send type if you want later:
        type,
      };

      const res = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to create post");
      }

      // Let parent know a new post was created (optional)
      onSubmit?.(data);

      // clear form + close
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

  return (
    <div
      className="cp"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cpTitle"
      onClick={onClose}
    >
      <div className="cp__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cp__head">
          <h2 id="cpTitle" className="cp__title">
            Create a post
          </h2>
          <button className="cp__close" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Type selector */}
        <div className="cp__seg" role="group" aria-label="Post type">
          <button
            type="button"
            className={`cp__segBtn ${type === "wanted" ? "is-active" : ""}`}
            onClick={() => setType("wanted")}
          >
            Wanted
          </button>
          <button
            type="button"
            className={`cp__segBtn ${type === "offer" ? "is-active" : ""}`}
            onClick={() => setType("offer")}
          >
            Offer
          </button>
        </div>

        <form className="cp__form" onSubmit={handleSubmit}>
          <label htmlFor="cpTitle" className="cp__label">
            Title
          </label>
          <input
            id="cpTitle"
            className="cp__input"
            placeholder={
              type === "wanted"
                ? "e.g., Need help fixing a leaky faucet"
                : "e.g., I can fix leaky faucets this weekend"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="cpDesc" className="cp__label">
            Description
          </label>
          <textarea
            id="cpDesc"
            className="cp__textarea"
            rows="4"
            placeholder="Add helpful details…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <label htmlFor="cpZip" className="cp__label">
            ZIP Code
          </label>
          <input
            id="cpZip"
            className="cp__input"
            type="text"
            placeholder="e.g., 75701"
            pattern="[0-9]{5}"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            required
          />

          <label htmlFor="cpFiles" className="cp__label">
            Add photo or video
          </label>
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
            <button
              type="button"
              className="cp__btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cp__btn cp__btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
