import React, { useCallback, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../styles/pages/home.css";
import Wordmark from "../components/Wordmark.jsx";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const [zipSearch, setZipSearch] = useState("");
  const [zipPosts, setZipPosts] = useState([]);


  // Check for existing token (from global store or localStorage)
  const token = store.token || localStorage.getItem("token");
  const handleZipSearch = useCallback((event) => { }, []);
  return (
    <main className="grid" aria-labelledby="homeTitle">
      {/* Left column: categories */}
      <aside className="grid__left">
        <section className="cats" aria-labelledby="catsTitle">
          <h2 id="catsTitle" className="cats__title">Categories</h2>

          {token ? (
            <div className="cats__chips">
              <Link className="chip" to="/animals">Animal</Link>
              <Link className="chip" to="/food">Food</Link>
              <Link className="chip" to="/honeydo">Honey Do's</Link>
            </div>
          ) : (
            <div className="p-3 rounded border bg-light">
              <p className="mb-2">Please log in to access categories.</p>
              <div className="d-flex gap-2">
                {/* <Link to="/login" className="btn btn-outline-primary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link> */}
              </div>
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
          <p className="wallSub">Neighbors help neighbors.</p>
        </header>

        {/* Zip / location search (placeholder) */}
        <div className="zip">
          <label className="zip__label" htmlFor="zipInput">
            Search by Your Zip Code to find local posts fast
          </label>
          <div className="zip__row">
            <input
              id="zipInput"
              className="zip__input"
              type="text"
              placeholder="e.g., 33101 or Miami, FL"
            />
            <button
              className="zip__btn"
              type="button"
              onClick={handleZipSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Backend connection card */}
        <article className="post">
          <h2 className="post__title">Backend connection</h2>
          <p className="post__details">
            {store.message
              ? store.message
              : "Loading from backend… (ensure your backend is running and VITE_BACKEND_URL is set)"}
          </p>
        </article>

        {/* Empty feed placeholder */}
        <div className="postList">
          <div className="post empty">Your feed will appear here.</div>
        </div>
      </section>

      {/* Right column left empty for now */}
      <div className="grid__right" aria-hidden="true" />
    </main>
  );
};
