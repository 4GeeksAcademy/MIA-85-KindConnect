import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="kc-footer" role="contentinfo">
        <div className="kc-footer__inner">

          <div className="kc-footer__col">
            <Link to="/about" className="kc-footer__miniLink">About us</Link>

            <div className="kc-footer__section">
              <div className="kc-footer__label">Keep in touch</div>
              <a href="mailto:kindconnect@gmail.com" className="kc-footer__link">
                kindconnect@gmail.com
              </a>
            </div>

            <div className="kc-footer__social">
              <a href="https://instagram.com" className="social-btn ig" target="_blank" rel="noopener noreferrer">IG</a>
              <a href="https://facebook.com" className="social-btn fb" target="_blank" rel="noopener noreferrer">F</a>
              <a href="https://x.com" className="social-btn x" target="_blank" rel="noopener noreferrer">X</a>
              <a href="https://snapchat.com" className="social-btn sc" target="_blank" rel="noopener noreferrer">SC</a>
              <a href="https://tiktok.com" className="social-btn tt" target="_blank" rel="noopener noreferrer">T</a>
              <a href="https://web.telegram.org" className="social-btn tg" target="_blank" rel="noopener noreferrer">TG</a>
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="kc-footer__col kc-footer__col--center">
            <div className="kc-footer__label">Address</div>
            <div className="kc-footer__address">1111 Brickell Ave, Miami, FL 33129</div>
          </div>

          <div className="kc-footer__col kc-footer__col--right">
            <div className="kc-footer__label">Get our app</div>

            <div className="stores">

              <a 
                href="https://www.apple.com/app-store/"
                className="storeBadge storeBadge--apple"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="storeIcon" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M14.2 5.4c..."/>
                  <path fill="#ffffff" d="M12 7.5c..."/>
                </svg>
                <span>App Store</span>
              </a>

              {/* Google Play */}
              <a 
                href="https://play.google.com/store/apps"
                className="storeBadge storeBadge--play"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="storeIcon" viewBox="0 0 24 24">
                  <polygon fill="#34A853" points="2,2 13,12 2,22"/>
                  <polygon fill="#FBBC05" points="13,12 20,8 20,16"/>
                  <polygon fill="#EA4335" points="2,2 20,8 13,12"/>
                  <polygon fill="#4285F4" points="13,12 20,16 2,22"/>
                </svg>
                <span>Google Play</span>
              </a>
            </div>
          </div>

        </div>
      </footer>

      <div className="kc-footer__bar">
        <span>&copy; {year} KindConnect · Neighbors helping neighbors.</span>
      </div>
    </>
  );
}
