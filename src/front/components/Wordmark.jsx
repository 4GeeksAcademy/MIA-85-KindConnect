import React from "react";

/** Renders: KindC ❤️ nnect  (big C + big red heart) */
export default function Wordmark({ as: Tag = "span", className = "" }) {
  return (
    <Tag className={`wm ${className}`}>
      <span className="wm__k">Kind</span>
      <span className="wm__c">C</span>
      <span className="wm__heart" aria-label="heart" role="img">❤️</span>
      <span className="wm__rest">nnect</span>
    </Tag>
  );
}
