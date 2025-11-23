import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function CreatePost({
  open,
  onClose,
  postSubmitFn,
  category
}) {
  const { store } = useGlobalReducer();
  const [type, setType] = useState("needing");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
        // backend ignores extra keys, so we can send type if you want later:
        type,
        category
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

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to create post");
      }

      // 👉 Add new post into global feed (optional but nice UX)
      dispatch({ type: "add_post", payload: data });
      dispatch({
        type: "set_message",
        payload: "Post created successfully!"
      });

      // Let parent know, if it passed a callback
      postSubmitFn && postSubmitFn();

      // Clear form
      setTitle("");
      setDesc("");
      setZip("");
      setFiles([]);

      // Close modal
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
            className={`cp__segBtn ${type === "needing" ? "is-active" : ""}`}
            onClick={() => setType("needing")}
          >
            Wanted
          </button>
          <button
            type="button"
            className={`cp__segBtn ${type === "giving" ? "is-active" : ""}`}
            onClick={() => setType("giving")}
          >
            Offer
          </button>
        </div>

        <form className="cp__form" onSubmit={handleSubmit}>
          <label htmlFor="cpTitleInput" className="cp__label">
            Title
          </label>
          <input
            id="cpTitleInput"
            className="cp__input"
            placeholder={
              type === "needing"
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
              type="button"
              onClick={handleSubmit}
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
