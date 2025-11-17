import React from "react";
import { Link } from "react-router-dom";
import Wordmark from "../components/Wordmark.jsx";
import "../styles/pages/landing.css";

export default function Landing() {
  return (
    <main className="page--landing">
      <div className="page-surface">
        {/* Hero */}
        <section className="landing-hero">
          <h1 className="landing-hero__title">
            Welcome to <Wordmark />
          </h1>
          <p className="landing-hero__tagline">
            Thinking about scrolling to care rather than compare? Welcome to our world.
          </p>
          <p className="landing-hero__sub">
            Neighbors helping neighbors. Ask freely. Help gladly.
          </p>
        </section>

        {/* Tiles */}
        <div className="landing-tiles">
          {/* Honey Do’s */}
          <Link
            to="/honeydo"
            className="landing-card landing-card--honey"
            aria-label="Go to Honey Do’s (home projects)"
          >
            <div className="landing-card__emoji">🏠🛠️</div>
            <div className="landing-card__title">Honey Do’s</div>
            <div className="landing-card__desc">
              Home tasks & small fixes — ask for help or offer your skills.
            </div>
          </Link>

          {/* Food */}
          <Link
            to="/food"
            className="landing-card landing-card--food"
            aria-label="Go to Food hub"
          >
            <div className="landing-card__emoji">🍲🥗</div>
            <div className="landing-card__title">Food</div>
            <div className="landing-card__desc">
              Share extra meals or request food support in your area.
            </div>
          </Link>

          {/* Animal Fix */}
          <Link
            to="/animals"
            className="landing-card landing-card--animals"
            aria-label="Go to Animal Fix"
          >
            <div className="landing-card__emoji">🐶🐾</div>
            <div className="landing-card__title">Animal Fix</div>
            <div className="landing-card__desc">
              Fosters, rides, supplies, and care for pets in need.
            </div>
          </Link>
        </div>

        {/* CTA */}
        <p className="landing-cta">
          Don’t have an account yet?{" "}
          <Link to="/signup">Get started here</Link>.
        </p>
      </div>
    </main>
  );
}
