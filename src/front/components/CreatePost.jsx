import React, { useEffect, useState } from "react";

export default function CreatePost({ open, onClose, onSubmit, defaultType = "wanted" }) {
  const [type, setType] = useState(defaultType);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => setType(defaultType), [defaultType]);
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      type,                               // "wanted" or "offer" (auto-filled)
      title: title.trim(),
      description: desc.trim(),
      files                                // Array<File>
    };
    onSubmit?.(payload);
    onClose?.();
  };

  return (
    <div className="cp" role="dialog" aria-modal="true" aria-labelledby="cpTitle" onClick={onClose}>
      <div className="cp__panel" onClick={(e) => e.stopPropagation()}>
        <div className="cp__head">
          <h2 id="cpTitle" className="cp__title">Create a post</h2>
          <button className="cp__close" aria-label="Close" onClick={onClose}>✕</button>
        </div>

        <p className="cp__note">Posting as <strong>{type === "offer" ? "Offer" : "Wanted"}</strong></p>

        <form className="cp__form" onSubmit={handleSubmit}>
          <label htmlFor="cpTitle" className="cp__label">Title</label>
          <input
            id="cpTitle"
            className="cp__input"
            placeholder="e.g., Need help fixing a leaky faucet"
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

          <label htmlFor="cpFiles" className="cp__label">Add photo or video</label>
          <input
            id="cpFiles"
            className="cp__file"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          <div className="cp__actions">
            <button type="button" className="cp__btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="cp__btn cp__btn--primary">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
