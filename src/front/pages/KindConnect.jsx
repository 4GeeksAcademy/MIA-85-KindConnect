import React, { useState, useEffect } from "react";
import Taco from "../components/Taco.jsx";
import CreatePost from "../components/CreatePost.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import PostCard from "../components/PostCard.jsx";

export default function KindConnect() {
    const [zip, setZip] = useState("");
    const [filter, setFilter] = useState(null); // null | "wanted" | "offers"
    const [openCreate, setOpenCreate] = useState(false);

    const { store, dispatch } = useGlobalReducer();
    const posts = store.posts || [];

    // 1) Load ALL posts once when the page mounts (if we don't already have them)
    useEffect(() => {
        const loadAllPosts = async () => {
            if (posts.length > 0) return; // already have posts

            try {
                const resp = await fetch(`${store.API_BASE_URL}/api/posts`);
                if (!resp.ok) {
                    throw new Error(`Failed to load posts: ${resp.status}`);
                }
                const data = await resp.json();
                dispatch({ type: "set_posts", payload: data });
            } catch (err) {
                console.error("Error loading all posts:", err);
            }
        };

        loadAllPosts();
    }, [store.API_BASE_URL, posts.length, dispatch]);

    // 2) "Search" button – in this version, ZIP filtering is local only
    const handleNearbyPosts = () => {
        const trimmedZip = zip.trim();
        if (!trimmedZip) {
            console.warn("Please enter a ZIP code first.");
            return;
        }
        // We don't need to fetch here – filtered list below uses zip from state.
        // You could set a message if you like.
        console.log("Filtering food posts by ZIP:", trimmedZip);
    };

    // 3) Button to clear ZIP and show all food posts again
    const handleClearZip = () => {
        setZip("");
    };

    // 4) Filter posts by:
    //    - category === "food"
    //    - type (Wanted / Offers), if selected
    //    - zip IN THIS CATEGORY ONLY, if zip is set
    const filtered = posts.filter((p) => {
        if (p.category !== "food") return false;

        if (filter === "wanted" && p.type !== "needing") return false;
        if (filter === "offers" && p.type !== "giving") return false;

        const trimmedZip = zip.trim();
        if (trimmedZip && p.zip_code !== trimmedZip) return false;

        return true;
    });

    return (
        <main className="honey layout">
            <Taco />

            <div className="honey__grid">
                {/* LEFT SIDEBAR */}
                <aside className="honey__side">
                    <section className="hc hc--zip" aria-labelledby="zipLabel">
                        <label id="zipLabel" className="hc__label">
                            Find help near you
                        </label>
                        <input
                            className="hc__input"
                            placeholder="enter your zipcode"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            aria-describedby="zipHelp"
                        />
                        <div className="hc__zipActions">
                            <button
                                className="hc__btn"
                                type="button"
                                onClick={handleNearbyPosts}
                            >
                                See nearby posts
                            </button>
                            <button
                                className="hc__btn hc__btn--secondary"
                                type="button"
                                onClick={handleClearZip}
                            >
                                Clear ZIP
                            </button>
                        </div>
                    </section>

                    <section className="hc hc--create">
                        <h2 className="hc__h2">Create your post</h2>
                        <p className="hc__help">
                            Need a hand or have something to offer? POST!
                        </p>
                        <button
                            className="hc__btn hc__btn--primary"
                            type="button"
                            onClick={() => setOpenCreate(true)}
                        >
                            Create post
                        </button>
                    </section>
                </aside>

                {/* CENTER FEED */}
                <section className="honey__feed">
                    <nav className="honey__tabs" aria-label="Post filters">
                        <button
                            className={`honey__tab ${filter === "wanted" ? "is-active" : ""}`}
                            onClick={() => setFilter("wanted")}
                            type="button"
                        >
                            Wanted
                        </button>
                        <button
                            className={`honey__tab ${filter === "offers" ? "is-active" : ""}`}
                            onClick={() => setFilter("offers")}
                            type="button"
                        >
                            Offers
                        </button>
                        <button
                            className={`honey__tab ${filter === null ? "is-active" : ""}`}
                            onClick={() => setFilter(null)}
                            type="button"
                        >
                            All
                        </button>
                    </nav>

                    <ul className="honey__list" aria-live="polite">
                        {filtered.length === 0 && (
                            <li className="honey__empty">
                                No posts yet. Try a different ZIP or create your post.
                            </li>
                        )}

                        {filtered.map((p) => (
                            <li key={p.id} className="honey__post">
                                <PostCard post={p} />
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Compose modal – stays on this page */}
            <CreatePost
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                category="food"
                postSubmitFn={() => console.log("Created KindConnect post!")}
            />
        </main>
    );
}
