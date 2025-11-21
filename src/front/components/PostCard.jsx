// src/front/components/PostCard.jsx
import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// mascots
import mascAnimals from "../assets/img/mascot_animals.png";
import mascFood from "../assets/img/mascot_food.png";
import mascHoney from "../assets/img/mascot_honeydos.png";

export default function PostCard({ post }) {
    const { store, dispatch } = useGlobalReducer();
    const [localReplies, setLocalReplies] = useState(post.replies || []);
    useEffect(() => {
        setLocalReplies(post.replies || []);
    }, [post.replies]);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [isFavLoading, setIsFavLoading] = useState(false);
    const isLoggedIn = !!(store.token || localStorage.getItem("token"));

    if (!post) return null;

    const favoritesCount = post.favorites_count ?? 0;
    const isFavorited = post.is_favorited ?? false;

    // Mascot selection by category (watermark)
    const categoryKey = (post.category || "").toLowerCase();
    const mascotMap = {
        animals: mascAnimals,
        food: mascFood,
        "honey-dos": mascHoney,
        honeydos: mascHoney,
    };
    const mascotImg = mascotMap[categoryKey];

    // Toggle favorite using /posts/<pid>/favorite
    const handleToggleFavorite = async () => {
        if (!post.id) return;
        setIsFavLoading(true);

        try {
            const resp = await fetch(
                `${store.API_BASE_URL}/api/posts/${post.id}/favorite`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // backend expects device_id
                    body: JSON.stringify({ device_id: "web-client" }),
                }
            );

            if (!resp.ok) {
                throw new Error(`Favorite failed: ${resp.status}`);
            }

            const data = await resp.json(); // { favorited, favorites_count }

            const currentPosts = store.posts || [];
            const updatedPosts = currentPosts.map((p) =>
                p.id === post.id
                    ? {
                        ...p,
                        is_favorited: data.favorited,
                        favorites_count: data.favorites_count,
                    }
                    : p
            );

            dispatch({ type: "set_posts", payload: updatedPosts });
        } catch (err) {
            console.error("Favorite toggle error:", err);
        } finally {
            setIsFavLoading(false);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const body = replyText.trim();
        if (!body || !post.id) return;

        setIsReplying(true);
        try {
            const payload = {
                body,
                author:
                    store.user?.username ||
                    store.user?.email ||
                    `${store.user?.first_name || ""} ${store.user?.last_name || ""}`.trim() ||
                    "anon",
            };

            const resp = await fetch(
                `${store.API_BASE_URL}/api/posts/${post.id}/reply`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!resp.ok) {
                throw new Error(`Reply failed: ${resp.status}`);
            }

            const data = await resp.json().catch(() => ({}));
            const newReply = data.id
                ? { id: data.id, body: payload.body, author: payload.author, created_at: data.created_at || new Date().toISOString() }
                : { id: `temp-${Date.now()}`, body: payload.body, author: payload.author, created_at: new Date().toISOString() };

            // update local replies for immediate render
            setLocalReplies((r) => [...r, newReply]);

            // update global store as before (keep or remove if redundant)
            const currentPosts = store.posts || [];
            const updatedPosts = currentPosts.map((p) =>
                p.id === post.id
                    ? {
                        ...p,
                        replies: [...(p.replies || []), newReply],
                        replies_count: (p.replies_count || 0) + 1,
                    }
                    : p
            );
            dispatch({ type: "set_posts", payload: updatedPosts });

            setReplyText("");
            setShowReplyBox(false);
        } catch (err) {
            console.error("Reply error:", err);
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <article className="postCard">
            <header className="postCard__top">
                <div>
                    <h3 className="postCard__author">{post.author || "anon"}</h3>
                    {post.category && (
                        <span className="postCard__category">{post.category}</span>
                    )}
                </div>

                <span
                    className={
                        "postCard__type " +
                        (post.type === "needing"
                            ? "postCard__type--needing"
                            : "postCard__type--giving")
                    }
                >
                    {post.type === "needing" ? "Wanted" : "Offer"}
                </span>
            </header>

            <p className="postCard__body">{post.body}</p>

            <footer className="postCard__footer">
                <div className="postCard__meta">
                    {post.zip_code && <>📍 {post.zip_code}</>}
                    {post.zip_code && post.created_at && "  •  "}
                    {post.created_at && <>📅 {new Date(post.created_at).toLocaleDateString()}</>}
                </div>

                {isLoggedIn && (
                    <div className="postCard__actions">
                        <button
                            type="button"
                            className={`postCard__favBtn ${isFavorited ? "is-favorited" : ""
                                }`}
                            onClick={handleToggleFavorite}
                        >
                            ♥ Favorite {favoritesCount ? `(${favoritesCount})` : ""}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowReplyBox((v) => !v)}
                        >
                            💬 Reply
                        </button>
                    </div>
                )}
            </footer>

            {isLoggedIn && showReplyBox && (
                <form className="postCard__replyForm" onSubmit={handleReplySubmit}>
                    <textarea
                        className="postCard__replyInput"
                        rows={2}
                        placeholder="Write a reply…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="postCard__replyActions">
                        <button
                            type="button"
                            className="postCard__replyCancel"
                            onClick={() => setShowReplyBox(false)}
                            disabled={isReplying}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="postCard__replySubmit"
                            disabled={isReplying || !replyText.trim()}
                        >
                            {isReplying ? "Posting…" : "Post reply"}
                        </button>
                    </div>
                </form >
            )}

            {/* render replies */}
            {localReplies && localReplies.length > 0 && (
                <div className="postCard__replies">
                    {localReplies.map((r) => (
                        <div key={r.id} className="postCard__reply">
                            <div className="postCard__replyMeta">
                                <strong>{r.author || "anon"}</strong>{" "}
                                <span className="postCard__replyDate">
                                    {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                                </span>
                            </div>
                            <div className="postCard__replyBody">{r.body}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mascot watermark (optional) */}
            {
                mascotImg && (
                    <img src={mascotImg} alt="mascot" className="postCard__mascot" />
                )
            }
        </article >
    );
}