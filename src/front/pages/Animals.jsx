import React, { useCallback, useEffect, useMemo, useState } from "react";
import CreatePost from "../components/CreatePost.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../styles/pages/animals.css";
import dogImg from "../assets/img/dachshund.jpg"; 
import animalsbg from "../assets/img/Animal_BG.png";
export default function Animals() {
  const [zip, setZip] = useState("");
  const [filter, setFilter] = useState("seeking"); 
  const [openCreate, setOpenCreate] = useState(false);
  const { store, dispatch } = useGlobalReducer();

  const filtered = useMemo(
    () => store.posts.filter(p => p.type === filter && p.category === "animals"),
    [store.posts, filter]
  );

  // Load posts from API
  const getPosts = useCallback(async () => {
    try {
      const response = await fetch(`${store.API_BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${store.token}` }
      });
      if (!response.ok) return;
      const body = await response.json();
      dispatch({ type: "set_posts", payload: body });
    } catch (e) {
      console.warn("Failed to fetch posts", e);
    }
  }, [store.API_BASE_URL, store.token, dispatch]);

  useEffect(() => { getPosts(); }, [getPosts]);

  return (
    
    <main className="page--animals" style={{ "--animals-bg": `url(${animalsbg})` }}>
      <div className="page-surface">
        {/* Hero */}
        <header className="honey__hero">
          <h1 className="honey__title">
              Helping Animals
            <span
              aria-hidden="true"
              style={{
              display: "inline-block",
              width: "clamp(52px, 5vw + 28px, 96px)",
              height: "clamp(52px, 5vw + 28px, 96px)",
              marginLeft: 12,
              borderRadius: "50%",
              backgroundImage: `url(${dogImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 0 0 3px rgba(0,0,0,0.06)"
              }}
            />
          </h1>

          <p className="honey__desc">
            Help a pet or find help for one—food, fosters, rides, supplies, and care.
            <br />
            Seeking or sharing, your neighbors are here for the animals.
          </p>
        </header>

        <div className="honey__grid">
          {/* LEFT SIDEBAR */}
          <aside className="honey__side">
            <section className="hc hc--zip" aria-labelledby="zipLabel">
              <label id="zipLabel" className="hc__label">Find Post Near You</label>
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
              <p className="hc__help">Help a pet or Need help for one? post!</p>
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
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <li key={p.id} className="hc">
                    <strong>{p.title || p.author || "Neighbor"}</strong>
                    <div style={{ color: "var(--muted)" }}>{p.body}</div>
                  </li>
                ))
              ) : (
                <li className="honey__empty">
                  No posts yet. Try a different ZIP or create your post.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Create Post modal */}
      <CreatePost
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        postSubmitFn={getPosts}
        category="animals"
        defaultType={filter}
        heading="Help a pet or Need help for one? post!"
      />
    </main>
  );
}
