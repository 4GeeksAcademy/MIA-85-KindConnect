import { useEffect, useState } from "react";

let API = `${location.protocol}//${location.hostname}:3001/api`;
try {
    if (API_URL) API = API_URL;
} catch (_) { }

function getDeviceId() {
    let id = localStorage.getItem("device_id");
    if (!id) {
        id = "dev-" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem("device_id", id);
    }
    return id;
}

export default function Food() {
    const [posts, setPosts] = useState([]);
    const [meal, setMeal] = useState("");
    const [author, setAuthor] = useState("");
    const [replyText, setReplyText] = useState({});
    const [msg, setMsg] = useState("");

    const deviceId = getDeviceId();

    async function load() {
        setMsg("");
        try {
            const r = await fetch(`${API}/posts?device_id=${encodeURIComponent(deviceId)}`);
            const data = await r.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            setMsg("Failed to load food posts.");
        }
    }

    useEffect(() => { load(); }, []);

    async function shareMeal(e) {
        e.preventDefault();
        if (!meal.trim()) { setMsg("Please describe your dish!"); return; }
        const payload = { body: meal.trim(), author: author.trim() || "Foodie" };
        const r = await fetch(`${API}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!r.ok) { setMsg("Could not share your meal."); return; }
        setMeal(""); setAuthor("");
        load();
    }

    async function reply(postId) {
        const text = (replyText[postId] || "").trim();
        if (!text) return;
        const r = await fetch(`${API}/posts/${postId}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: text })
        });
        if (!r.ok) { setMsg("Comment failed."); return; }
        setReplyText(prev => ({ ...prev, [postId]: "" }));
        load();
    }

    async function toggleFav(postId) {
        const r = await fetch(`${API}/posts/${postId}/favorite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id: deviceId })
        });
        if (!r.ok) { setMsg("Favorite failed."); return; }
        load();
    }

    return (
        <div className="container py-4">
            <h1 className="mb-1">🍽️ Food Feed</h1>
            <p className="text-muted mb-4">Share meals, comment on dishes, and favorite your faves.</p>

            {msg && <div className="alert alert-warning">{msg}</div>}
            <form onSubmit={shareMeal} className="card card-body mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Your Name (optional)</label>
                        <input
                            className="form-control"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Chef, foodie, or hungry human..."
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">What’s on your plate?</label>
                        <input
                            className="form-control"
                            value={meal}
                            onChange={(e) => setMeal(e.target.value)}
                            placeholder="e.g., Homemade Tacos with Salsa Verde"
                            required
                        />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100">Share Meal</button>
                    </div>
                </div>
            </form>

            <div className="row g-3">
                {posts.map(p => (
                    <div className="col-md-6" key={p.id}>
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title mb-1">{p.author || "Foodie"}</h5>
                                <p className="card-text mb-2">{p.body}</p>
                                <div className="text-muted small mb-3">
                                    {p.replies_count ?? (p.replies ? p.replies.length : 0)} comments · {p.favorites_count} favorites
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn ${p.is_favorited ? "btn-outline-danger" : "btn-outline-primary"}`}
                                        onClick={() => toggleFav(p.id)}
                                    >
                                        {p.is_favorited ? "💔 Unfavorite" : "❤️ Favorite"}
                                    </button>
                                </div>

                                <hr />

                                <div className="input-group mt-auto">
                                    <input
                                        className="form-control"
                                        placeholder="Write a comment…"
                                        value={replyText[p.id] || ""}
                                        onChange={(e) => setReplyText(prev => ({ ...prev, [p.id]: e.target.value }))}
                                    />
                                    <button className="btn btn-secondary" onClick={() => reply(p.id)}>Comment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-light border">No dishes yet. Be the first to share!</div>
                    </div>
                )}
            </div>
        </div>
    );
}
