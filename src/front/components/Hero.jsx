import React from "react";

export default function Hero() {
  return (
    <header className="honey__hero">
      <h1 className="honey__title">
        Honey Do’s
        <span className="heroEmoji heroEmoji--title" aria-hidden="true">🏠🛠️</span>
      </h1>
      <p className="honey__desc">
        Find help for home projects—repairs, fixes, and small tasks.<br/>
        Offer your skills or request a hand from neighbors, and give away extra home appliances.
      </p>
    </header>
  );
}
