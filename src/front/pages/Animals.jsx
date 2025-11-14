import React, { useCallback, useEffect, useMemo, useState } from "react";
import Dog from "../components/Dog.jsx";
import CreatePost from "../components/CreatePost.jsx"; // simple post composer overlay
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export default function Animals() {
  const [zip, setZip] = useState("");
  const [filter, setFilter] = useState("needing");     // "needing" | "giving"
  const [openCreate, setOpenCreate] = useState(false);
  const { store, dispatch } = useGlobalReducer();
  // no data yet
  const filtered = useMemo(() => store.posts
    .filter(p => p.type === filter && p.category === "animals"), [store.posts, filter]);
  const getPosts = useCallback(async () => {
    const response = await fetch(
      `${store.API_BASE_URL}/api/posts`, {
      headers: {
        "Authorization": `Bearer ${store.token}`
      }
    }
    );
    if (!response.ok) return;
    const body = await response.json();
    dispatch({
      type: "set_posts",
      payload: body
    });
  }, [store.token]);
  const handleCreateSubmit = () => {
    getPosts();
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <main className="honey layout">
      <Dog />
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
              className={`honey__tab ${filter === "needing" ? "is-active" : ""}`}
              onClick={() => setFilter("needing")}
              type="button"
            >
              Wanted
            </button>
            <button
              className={`honey__tab ${filter === "giving" ? "is-active" : ""}`}
              onClick={() => setFilter("giving")}
              type="button"
            >
              Offers
            </button>
          </nav>

          <ul className="honey__list" aria-live="polite">
            <li>{filtered.length}</li>
            {filtered.length > 0 ? (
              <>
                {filtered.map((_post) => {
                  return (
                    <li key={_post.id}>{_post.body}</li>
                  )
                })}
              </>
            ) : (
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
        postSubmitFn={handleCreateSubmit}
        category={"honey-dos"}
      />
    </main>
  );
}