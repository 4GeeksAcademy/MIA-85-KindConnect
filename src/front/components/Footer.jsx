import React from "react";
import {Link} from "react-router-dom";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
  
      <footer className="kc-footer" role="contentinfo">
        <div className="kc-footer__inner">
          {/* LEFT: About + Keep in touch + Socials */}
          <div className="kc-footer__col">
            <Link to="/about" className="kc-footer__miniLink">About Us❤️</Link>
            <div className="kc-footer__section">
              <div className="kc-footer__label">Contact us by email, socials and more: </div>
              <a href="mailto:kindconnect@gmail.com" className="kc-footer__link">
                kindconnect@gmail.com
              </a>
            </div>
            <div className="kc-footer__section" aria-label="Social links">
              <div className="kc-footer__social">
                <a className="soc soc--fb" href="https://facebook.com" aria-label="Facebook">f</a>
                <a className="soc soc--x" href="https://x.com" aria-label="X / Twitter">x</a>
                <a className="soc soc--ig" href="https://instagram.com" aria-label="Instagram">ig</a>
                <a className="soc soc--sc" href="https://snapchat.com" aria-label="Snapchat">sc</a>
                <a className="soc soc--tt" href="https://tiktok.com" aria-label="TikTok">tt</a>
                <a className="soc soc--tg" href="https://web.telegram.org" aria-label="Telegram">tg</a>
              </div>
            </div>
          </div>
          {/* MIDDLE: Address only */}
          <div className="kc-footer__col kc-footer__col--center">
            <div className="kc-footer__label">Address</div>
            <div className="kc-footer__address">1111 Brickell Ave, Miami, FL 33129</div>
          </div>
          {/* RIGHT: App badges */}
          <div className="kc-footer__col kc-footer__col--right">
            <div className="kc-footer__label">Get our app</div>
            <div className="stores">
              {/* App Store */}
              <a href="https://www.apple.com/app-store/" className="storeBadge storeBadge--apple" aria-label="App Store">
                <svg className="storeIcon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#FFF7E6" d="M14.2 5.4c.5-.7.8-1.5.7-2.3-.8.1-1.6.6-2.2 1.3-.5.6-.8 1.4-.7 2.2.8.1 1.5-.4 2.2-1.2z"/>
                  <path fill="#FFF7E6" d="M12 7.5c2 0 3.3 1 3.9 2.1.6 1.1.7 2.3.5 3.3-.4 2.2-2.1 4.9-3.6 4.9-.9 0-1.4-.6-2.6-.6s-1.7.6-2.6.6c-1.6 0-3.7-3-4-5.3-.2-1.2 0-2.5.7-3.6.7-1.1 1.8-2 3.2-2 1.2 0 1.9.6 2.7.6s1.5-.6 2.8-.6z"/>
                </svg>
                <span>App Store</span>
              </a>

              {/* Google Play */}
              <a href="https://play.google.com/store/apps" className="storeBadge storeBadge--play" aria-label="Google Play">
                <svg className="storeIcon" viewBox="0 0 24 24" aria-hidden="true">
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
    
  );
}
