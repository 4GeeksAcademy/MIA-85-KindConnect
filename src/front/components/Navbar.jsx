import React from "react";
import logo from "../assets/img/logopng.png";

export default function Nav() {
  return (
    <header className="header">
      
      <a href="#" className="brand__link" aria-label="KindConnect home">
        <img src={logo} alt="" className="brand__logo" />
        <span className="wm" aria-label="KindConnect">
          Kind<span className="wm__c" aria-hidden="true">C</span>
          <span className="wm__heart" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" role="img" aria-label="heart">
              <path fill="#E53935" d="M12 21s-6.7-4.35-9.33-7.03A6 6 0 1 1 11.98 6a6 6 0 1 1 9.35 7.97C18.7 16.65 12 21 12 21z"/>
            </svg>
          </span>
          nnect
        </span>
      </a>

      {/* Right: actions */}
      <nav className="nav">
        <a href="#" className="nav__link">Home</a>
        <a href="#" className="nav__btn">Log in</a>
      </nav>
    </header>
  );
}
