import { useEffect, useState } from "react";
import PostFormModal from "../components/PostFormModal.jsx";

let API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function KindConnect() {
    const [tab, setTab] = useState("donate");
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [posts, setPosts] = useState([]);
    const [msg, setMsg] = useState("");
    const [showPostModal, setShowPostModal] = useState(false);

    const categories = ["Animal", "Food", "Honey Do's"];

    async function loadPosts() {
        setMsg("");
        try {
            const res = await fetch(`${API}/posts`);
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            setMsg("Failed to load posts from backend.");
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    function handleSearch(e) {
        e.preventDefault();
        const term = q.trim().toLowerCase();
        if (!term) {
            loadPosts();
            return;
        }
        setPosts((prev) =>
            prev.filter((p) => (p.body || "").toLowerCase().includes(term))
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Header */}
            <header className="border-bottom">
                <div className="container-fluid py-2">
                    <h3 className="m-0 fw-bold">
                        Kind<span style={{ color: "#0d6efd" }}>💙</span>Connect
                    </h3>
                </div>
            </header>

            {/* Main layout */}
            <div className="container-fluid my-3 flex-fill">
                <div className="row g-3">
                    {/* Sidebar */}
                    <aside className="col-12 col-md-2">
                        <button
                            className="btn btn-success w-100 mb-3"
                            onClick={() => {
                                console.log("open modal"); // 👈 DEBUG LOG (shows in browser console)
                                setShowPostModal(true);    // 👈 opens the modal
                            }}
                        >
                            Post
                        </button>

                        <div className="border rounded mb-3">
                            <div className="d-flex align-items-center px-3 py-2 border-bottom">
                                <span className="me-2">☰</span>
                                <strong>Filters</strong>
                            </div>
                            <div className="list-group list-group-flush">
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={
                                            "list-group-item list-group-item-action" +
                                            (category === c ? " active" : "")
                                        }
                                        onClick={() => setCategory(category === c ? "" : c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="col-12 col-md-8">
                        {/* Search bar */}
                        <form className="input-group mb-3" onSubmit={handleSearch}>
                            <input
                                id="locationSearch"              // ✅ unique ID
                                name="locationSearch"            // ✅ name attribute (helps autofill)
                                type="text"
                                className="form-control"
                                placeholder="zip / town / state search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                            <button className="btn btn-outline-secondary" type="submit">
                                Search
                            </button>
                        </form>

                        {/* Donate/Needs toggle */}
                        <div className="d-flex gap-2 mb-3">
                            <button
                                type="button"
                                className={`btn ${tab === "donate"
                                    ? "btn-outline-primary active"
                                    : "btn-outline-primary"
                                    }`}
                                onClick={() => setTab("donate")}
                            >
                                Donate
                            </button>
                            <button
                                type="button"
                                className={`btn ${tab === "needs"
                                    ? "btn-outline-secondary active"
                                    : "btn-outline-secondary"
                                    }`}
                                onClick={() => setTab("needs")}
                            >
                                Needs
                            </button>
                        </div>

                        {/* Posts feed */}
                        <div className="border rounded p-3" style={{ minHeight: 320 }}>
                            {msg && <p className="text-danger">{msg}</p>}
                            {!msg && posts.length === 0 && (
                                <p className="text-muted m-0">No posts yet.</p>
                            )}
                            <ul className="list-unstyled m-0">
                                {posts.map((p) => (
                                    <li
                                        key={p.id}
                                        className="border-bottom pb-2 mb-2"
                                        style={{ lineHeight: 1.3 }}
                                    >
                                        <strong>{p.author || "anon"}:</strong> {p.body}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </main>

                    <div className="col-md-2 d-none d-md-block" />
                </div>
            </div>

            {/* Footer */}
            <footer className="border-top">
                <div className="container py-3 text-center">
                    <p className="mb-1">
                        kindconnect@gmail.com
                        <br />
                        Facebook: Kind <span style={{ color: "#0d6efd" }}>💙</span>nnect ·
                        Twitter: Kind <span style={{ color: "#0d6efd" }}>💙</span>nnect ·
                        Instagram: Kind <span style={{ color: "#0d6efd" }}>💙</span>nnect
                    </p>
                    <p className="mb-0">
                        <strong>contact us</strong> at Ernesto&apos;s house &nbsp;|&nbsp;
                        <a href="#" className="fw-semibold text-decoration-none">
                            volunteer
                        </a>
                    </p>
                </div>
            </footer>

            {/* Modal (outside footer) */}
            <PostFormModal
                show={showPostModal}
                onClose={() => setShowPostModal(false)}
                onSubmit={async (postData) => {
                    try {
                        const r = await fetch(`${API}/posts`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(postData),
                        });
                        if (r.ok) {
                            setShowPostModal(false);
                            loadPosts(); // refresh posts list
                        }
                    } catch (e) {
                        console.error("Failed to post:", e);
                    }
                }}
            />
        </div>
    );
}
