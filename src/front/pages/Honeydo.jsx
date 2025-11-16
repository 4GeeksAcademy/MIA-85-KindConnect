import React, { useMemo, useState } from "react";
import Hero from "../components/Hero.jsx";
import CreatePost from "../components/CreatePost.jsx";
import "../styles/pages/honeydo.css";
import homebg from "../assets/img/home.png";

export default function Honeydo() {
  const [zip, setZip] = useState("");
  const [filter, setFilter] = useState("seeking"); // "seeking" | "sharing"
  const [openCreate, setOpenCreate] = useState(false);

  // demo: no data yet
  const posts = [];
  const filtered = useMemo(
    () => posts.filter((p) => p.type === filter),
    [posts, filter]
  );

  const handleCreateSubmit = (payload) => {
    // TODO: call /api/honey-do on your backend
    console.log("new post:", payload);
  };

  return (
    <main className="page--honeydo" style={{ "--home-bg": `url(${homebg})` }}>
      <div className="page-surface">
        <Hero />

        <div className="honey__grid">
          {/* LEFT: search + create */}
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

          {/* CENTER: feed */}
          <section className="honey__feed">
            <nav className="honey__tabs" aria-label="Post filters">
              <button
                className={`honey__tab ${filter === "seeking" ? "is-active" : ""}`}
                onClick={() => setFilter("seeking")}
                type="button"
              >
                Seeking
              </button>
              <button
                className={`honey__tab ${filter === "sharing" ? "is-active" : ""}`}
                onClick={() => setFilter("sharing")}
                type="button"
              >
                Sharing
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
      </div>

      {/* simple compose overlay */}
      <CreatePost
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
        category="honey-dos"
        defaultType={filter} // keep in sync with the active tab
        heading="Need a hand or have something to offer? POST!"
      />
    </main>
  );
}
