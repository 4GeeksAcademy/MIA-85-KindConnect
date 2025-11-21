import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// mascots – paths based on your folder screenshot
import mascAnimals from "../assets/img/mascot_animals.png";
import mascFood from "../assets/img/mascot_food.png";
import mascHoney from "../assets/img/mascot_honeydos.png";

export default function PostCard({ post }) {
    const { store } = useGlobalReducer();

    // Favorite / reply local state
    const [isFavorited, setIsFavorited] = useState(post.is_favorited || false);
    const [favoritesCount, setFavoritesCount] = useState(
        post.favorites_count || 0
    );
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    // --- Mascot selection by category ---
    const categoryKey = (post.category || "").toLowerCase();
    const mascotMap = {
        animals: mascAnimals,
        food: mascFood,
        "honey-dos": mascHoney,
        honeydos: mascHoney, // just in case
    };
    const mascotImg = mascotMap[categoryKey];

    // remove debug logging in production

    // --- Type pill (Offer / Wanted) ---
    const isNeeding = post.type === "needing";
    const typeLabel = isNeeding ? "WANTED" : "OFFER";
    const typeClass = isNeeding
        ? "postCard__type postCard__type--needing"
        : "postCard__type postCard__type--giving";

    const dateText = post.created_at
        ? new Date(post.created_at).toLocaleDateString()
        : "";

    // ---- Favorite handler ----
    const handleFavorite = async () => {
        // simple device id for favorite tracking
        let deviceId = localStorage.getItem("kc_device_id");
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem("kc_device_id", deviceId);
        }

        try {
            const url = `${store.API_BASE_URL}/api/posts/${post.id}/favorite`;
            console.log("Favorite URL:", url); // debug

            const resp = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ device_id: deviceId }),
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || "Favorite failed");

            setIsFavorited(data.favorited);
            if (typeof data.favorites_count === "number") {
                setFavoritesCount(data.favorites_count);
            }
        } catch (err) {
            console.error("Favorite toggle error:", err);
        }
    };

    // ---- Reply handler ----
    const handleReplySubmit = async (e) => {
        e.preventDefault();
        const body = replyText.trim();
        if (!body) return;

        try {
            setSendingReply(true);
            const resp = await fetch(
                `${store.API_BASE_URL}/api/posts/${post.id}/reply`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        body,
                        author:
                            store.user?.username ||
                            store.user?.email ||
                            "anon",
                    }),
                }
            );

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || "Reply failed");

            setReplyText("");
            setShowReply(false);
        } catch (err) {
            console.error("Reply error:", err);
        } finally {
            setSendingReply(false);
        }
    };

    return (
        <article className="postCard">
            {/* Top row: author + category + type badge */}
            <header className="postCard__top">
                <div>
                    <h3 className="postCard__author">{post.author || "anon"}</h3>
                    {post.category && (
                        <span className="postCard__category">
                            {post.category.toLowerCase()}
                        </span>
                    )}
                </div>

                <span className={typeClass}>{typeLabel}</span>
            </header>

            {/* Body text */}
            <p className="postCard__body">{post.body}</p>

            {/* Footer meta + actions */}
            <footer className="postCard__footer">
                <div className="postCard__meta">
                    {post.zip_code && <>📍 {post.zip_code}</>}
                    {post.zip_code && dateText && "  •  "}
                    {dateText && <>📅 {dateText}</>}
                </div>

                <div className="postCard__actions">
                    <button
                        type="button"
                        className={`postCard__favBtn ${isFavorited ? "is-favorited" : ""}`}
                        onClick={handleToggleFavorite}
                    >
                        ♥ Favorite {favoritesCount ? `(${favoritesCount})` : ""}
                    </button>


                    <button
                        type="button"
                        onClick={() => setShowReply((v) => !v)}
                    >
                        💬 Reply
                    </button>
                </div>
            </footer>

            {/* Reply box */}
            {showReply && (
                <form
                    className="postCard__replyForm"
                    onSubmit={handleReplySubmit}
                >
                    <textarea
                        className="postCard__replyInput"
                        placeholder="Write a kind reply…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="postCard__replyActions">
                        <button
                            type="button"
                            className="postCard__replyCancel"
                            onClick={() => setShowReply(false)}
                            disabled={sendingReply}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="postCard__replySubmit"
                            disabled={sendingReply}
                        >
                            {sendingReply ? "Sending…" : "Send reply"}
                        </button>
                    </div>
                </form>
            )}

            {/* 🎨 Mascot watermark – always at the end of the article */}
            {mascotImg ? (
                <img
                    src={mascotImg}
                    alt="mascot"
                    className="postCard__mascot"
                />
            ) : (
                <div className="postCard__mascot-fallback">🎨</div>
            )}
            {/* end */}
        </article>
    );
}
