import { useState } from "react";

export default function PostFormModal({ show, onClose, onSubmit }) {
    const [author, setAuthor] = useState("");
    const [body, setBody] = useState("");

    if (!show) return null;

    function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;
        onSubmit({ author: author.trim() || "anon", body: body.trim() });
        setAuthor("");
        setBody("");
    }

    return (
        <div
            className="modal show"
            tabIndex="-1"
            style={{
                position: "fixed",
                inset: 0,
                display: "block",
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 1055,
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create a Post</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="author" className="form-label">
                                    Your Name (optional)
                                </label>
                                <input
                                    id="author"
                                    name="author"
                                    type="text"
                                    className="form-control"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Chef, helper, neighbor..."
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="body" className="form-label">
                                    Post Details
                                </label>
                                <textarea
                                    id="body"
                                    name="body"
                                    className="form-control"
                                    rows="3"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Describe what you’re sharing or needing..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
