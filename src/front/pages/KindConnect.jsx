import React, { useMemo, useState } from "react";
import Taco from "../components/Taco.jsx";
import CreatePost from "../components/CreatePost.jsx"; // simple post composer overlay

export default function Food() {
    const [zip, setZip] = useState("");
    const [filter, setFilter] = useState("wanted");     // "wanted" | "offers"
    const [openCreate, setOpenCreate] = useState(false);

    // no data yet
    const posts = [];
    const filtered = useMemo(() => posts.filter(p => p.type === filter), [posts, filter]);

    const handleCreateSubmit = (payload) => {
        // TODO: replace with API call
        console.log("new post:", payload);
    };

    return (
        <main className="honey layout">
            <Taco />
            <div className="honey__grid">
                {/* LEFT SIDEBAR */}
                <aside className="honey__side">
                    <section className="hc hc--zip" aria-labelledby="zipLabel">
                        <label id="zipLabel" className="hc__label">Find help near you</label>
                        <input
                            className="hc__input"
                            placeholder="enter your zipcode"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            aria-describedby="zipHelp"
                        />
                        <button className="hc__btn" type="button">See nearby posts</button>
                    </section>

                    <section className="hc hc--create">
                        <h2 className="hc__h2">Create your post</h2>
                        <p className="hc__help">Need a hand or have something to offer? POST!</p>
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
                    </nav>

                    <ul className="honey__list" aria-live="polite">
                        {filtered.length === 0 && (
                            <li className="honey__empty">
                                No posts yet. Try a different ZIP or create your post.
                            </li>
                        )}
                    </ul>
                </section>
            </div>

            <CreatePost
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSubmit={handleCreateSubmit}
                defaultType={filter === "offers" ? "offer" : "wanted"}
            />
        </main>
    );
}
