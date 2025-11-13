import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="layout" style={{ padding: "32px 16px" }}>
      <section style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontWeight: 800, margin: 0 }}>Welcome to KindConnect</h1>
        <p style={{ color: "var(--muted)", margin: "8px 0 20px" }}>
          Neighbors helping neighbors — find help or offer help in minutes.
        </p>

        {/* Quick category tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {/* Honey Do’s */}
          <Link
            to="/honeydo"
            style={{
              textDecoration: "none",
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--surface)",
              color: "var(--ink)",
              padding: "16px 14px",
              display: "grid",
              gap: 6,
              boxShadow: "0 8px 20px rgba(2,48,71,.06)",
            }}
            aria-label="Go to Honey Do’s (home projects)"
          >
            <div style={{ fontSize: 24 }}>🏠🛠️</div>
            <strong style={{ fontSize: 18 }}>Honey Do’s</strong>
            <span style={{ color: "var(--muted)" }}>
              Home tasks & small fixes — ask for help or offer your skills.
            </span>
          </Link>

          {/* Food */}
          <Link
            to="/food"
            style={{
              textDecoration: "none",
              border: "1px solid var(--border)",
              borderRadius: 12,
              background: "var(--surface)",
              color: "var(--ink)",
              padding: "16px 14px",
              display: "grid",
              gap: 6,
              boxShadow: "0 8px 20px rgba(2,48,71,.06)",
            }}
            aria-label="Go to Food hub"
          >
            <div style={{ fontSize: 24 }}>🍲🥗</div>
            <strong style={{ fontSize: 18 }}>Food</strong>
            <span style={{ color: "var(--muted)" }}>
              Share extra meals or request food support in your area.
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
