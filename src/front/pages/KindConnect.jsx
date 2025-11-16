import React, { useMemo, useState } from "react";
import CreatePost from "../components/CreatePost.jsx";
import "../styles/pages/food.css";

// Ensure Vite resolves both assets
import tacoImg from "../assets/img/taco.jpg";
import foodBg from "../assets/img/Food_BG.png"; // <-- your Food page BG

export default function KindConnect() {
  const [zip, setZip] = useState("");
  const [filter, setFilter] = useState("seeking");   // "seeking" | "sharing"
  const [openCreate, setOpenCreate] = useState(false);

  // demo: no data yet
  const posts = [];
  const filtered = useMemo(() => posts.filter(p => p.type === filter), [posts, filter]);

  const handleCreateSubmit = (payload) => {
    // TODO: hook to backend when ready
    console.log("new post:", payload);
  };

  return (
    // Bind the background via CSS var so bundler always finds it
    <main className="page--food" style={{ "--food-bg": `url(${foodBg})` }}>
      <div className="page-surface">
        {/* Hero */}
        <header className="honey__hero">
          <h1 className="honey__title">
            Food Donations{" "}
            <span
              className="foodEmoji foodEmoji--title"
              style={{ backgroundImage: `url(${tacoImg})` }}
              aria-hidden="true"
            />
          </h1>
          <p className="honey__desc">
            Connect with your community to give and receive food assistance.
            <br />
            Share meals, groceries, and resources to help those in need.
          </p>
        </header>

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
              <p className="hc__help">Share a meal or request one? POST!</p>
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

      {/* Compose overlay */}
      <CreatePost
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
        defaultType={filter}                         // "seeking" | "sharing"
        category="food"                              // backend Enum: "food"
        heading="Share a meal or request one? POST!" // Food-specific heading
      />
    </main>
  );
}
