import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "../styles/pages/home.css";
export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  return (
    <main className="grid" aria-labelledby="homeTitle">
      {/* Left column: categories (simple placeholders) */}
      <aside className="grid__left">
        <section className="cats" aria-labelledby="catsTitle">
          <h2 id="catsTitle" className="cats__title">Categories</h2>
          <div className="cats__chips">
            <button className="chip" type="button">Animal</button>
            <button className="chip" type="button">Food</button>
            <button className="chip" type="button">Honey Do's</button>
          </div>
        </section>
      </aside>

      {/* Center column: Wall */}
      <section className="grid__center">
        <header className="wallHead">
          <h1 id="homeTitle" className="wallTitle">
          Welcome to{" "}
          <span className="wm" aria-label="KindConnect">
          Kind
          <span className="wm__c" aria-hidden="true">C</span>
          <span className="wm__heart" role="img" aria-label="heart">❤</span>
            nnect
          </span>
          </h1>
          <p className="wallSub">Neighbors helping neighbors.</p>
        </header>

        {/* Zip / location search (placeholder) */}
        <div className="zip">
          <label className="zip__label" htmlFor="zipInput">Search by Your Zip Code to find local posts fast</label>
          <div className="zip__row">
            <input id="zipInput" className="zip__input" type="text" placeholder="e.g., 33101 or Miami, FL" />
            <button className="zip__btn" type="button">Search</button>
          </div>
        </div>

        {/* Backend connection card */}
        <article className="post">
           <h2 className="post__title">About Us:</h2>
            <p className="post__details">
        {store.message
          ? store.message
           : `KindConnect was made with a lot of love to help others with acts of service—free, neighbor to neighbor.
              Need volunteers or want to adopt? KindConnect.🐶
              Have extra home-cooked food or made too much? KindConnect.🍕
              Need help around the house or want to help someone fix their sink? KindConnect.🛠️
              If you’d like to volunteer for rides or other needs, we’d love to hear from you!❤️`}
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