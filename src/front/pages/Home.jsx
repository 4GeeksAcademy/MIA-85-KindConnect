import React, { useCallback, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../styles/pages/home.css";
import PostCard from "../components/PostCard.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const token = store.token || localStorage.getItem("token");

  // Load ALL posts (used on mount and when clearing search)
  const loadAllPosts = useCallback(async () => {
    try {
      const resp = await fetch(`${store.API_BASE_URL}/api/posts`);
      if (!resp.ok) throw new Error(`Failed to load posts: ${resp.status}`);
      const data = await resp.json();
      dispatch({ type: "set_posts", payload: data });
      dispatch({
        type: "set_message",
        payload: "Showing all recent posts.",
      });
    } catch (err) {
      console.error("Error loading posts on Home:", err);
      dispatch({
        type: "set_message",
        payload: "Error loading posts.",
      });
    }
  }, [dispatch, store.API_BASE_URL]);

  // Load all posts once when the page mounts
  useEffect(() => {
    loadAllPosts();
  }, [loadAllPosts]);

  // Search by ZIP
  const handleZipSearch = useCallback(async () => {
    const input = document.getElementById("zipInput");
    const zip = input?.value.trim() || "";

    if (!zip) {
      dispatch({
        type: "set_message",
        payload: "Please enter a ZIP code to search.",
      });
      return;
    }

    try {
      dispatch({ type: "set_message", payload: "Searching..." });

      const resp = await fetch(`${store.API_BASE_URL}/api/posts/zip/${zip}`);
      if (!resp.ok) throw new Error(`Search failed: ${resp.status}`);

      const posts = await resp.json();
      dispatch({ type: "set_posts", payload: posts });

      if (posts.length === 0) {
        dispatch({
          type: "set_message",
          payload: `No posts found for ZIP ${zip}.`,
        });
      } else {
        dispatch({
          type: "set_message",
          payload: `Found ${posts.length} post(s) near ZIP ${zip}.`,
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: "set_message",
        payload: "Error searching by ZIP. Please try again.",
      });
    }
  }, [dispatch, store.API_BASE_URL]);

  // Clear ZIP + restore all posts
  const handleClearSearch = useCallback(async () => {
    const input = document.getElementById("zipInput");
    if (input) input.value = "";
    await loadAllPosts();
  }, [loadAllPosts]);

  return (
    <main className="grid" aria-labelledby="homeTitle">
      {/* Left column: categories */}
      <aside className="grid__left">
        <section className="cats" aria-labelledby="catsTitle">
          <h2 id="catsTitle" className="cats__title">
            Categories
          </h2>

          {token ? (
            <div className="cats__chips">
              <Link className="chip" to="/animals">
                Animal
              </Link>
              <Link className="chip" to="/food">
                Food
              </Link>
              <Link className="chip" to="/honeydo">
                Honey Do&apos;s
              </Link>
            </div>
          ) : (
            <div className="p-3 rounded border bg-light">
              <p className="mb-2">Please log in to access categories.</p>
              <div className="d-flex gap-2">{/* login/signup later */}</div>
            </div>
          )}
        </section>
      </aside>

      {/* Center column: Wall */}
      <section className="grid__center">
        <header className="wallHead">
          <h1 id="homeTitle" className="wallTitle">
            Welcome, this is where
          </h1>
          <p className="wallSub">We come to help.</p>
        </header>

        {/* Zip / location search */}
        <div className="zip">
          <label className="zip__label" htmlFor="zipInput">
            Search by Your Zip Code to find local posts fast
          </label>
          <div className="zip__row">
            <input
              id="zipInput"
              className="zip__input"
              type="text"
              placeholder="e.g., 33101 or 75701"
            />
            <button
              className="zip__btn"
              type="button"
              onClick={handleZipSearch}
            >
              Search
            </button>
            <button
              className="zip__btn zip__btn--secondary"
              type="button"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Intro / status card */}
        <article className="post">
          <h2 className="post__title">Neighbors Helping Neighbors Near You</h2>
          <p className="post__details">
            {store.message
              ? store.message
              : "Search by ZIP or clear to view all posts from your area."}
          </p>
        </article>

        {/* Feed: render posts from global store */}
        <div className="postList">
          {store.posts && store.posts.length > 0 ? (
            store.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="post empty">
              Your feed will appear here once neighbors start posting.
            </div>
          )}
        </div>
      </section>

      {/* Right column left empty for now */}
      <div className="grid__right" aria-hidden="true" />
    </main >
  );
};
