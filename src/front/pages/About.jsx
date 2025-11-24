import React from "react";
import Wordmark from "../components/Wordmark.jsx";
export default function About() {
  return (
    <main className="layout" style={{ padding: "24px 16px", maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontWeight: 800, margin: "0 0 8px" }}>About <Wordmark /></h1>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Neighbors helping neighbors—no strings, just heart.
      </p>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>Our why</h2>
        <p style={{ margin: 0, color: "var(--ink)" }}>
          We started KindConnect with a simple belief: help shouldn’t be hard to ask for,
          and kindness shouldn’t be hard to give. From tightening a leaky faucet to sharing a
          spare casserole, small acts can change someone’s week—and sometimes their life.
        </p>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>A tiny story (that isn’t tiny)</h2>
        <p style={{ margin: 0, color: "var(--ink)" }}>
          Mrs. Diaz, 72, stared at a wobbly kitchen shelf for months. She didn’t want to
          “bother anyone.” On KindConnect, she posted a quick note. Two blocks away,
          Amir—who fixes things on weekends—saw it. He brought a drill, tightened four screws,
          and stayed for tea. The shelf is steady now, but the real fix was the feeling that
          we’re not alone where we live.
        </p>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>What we do</h2>
        <ul style={{ margin: "0 0 0 18px", color: "var(--ink)" }}>
          <li><strong>Honey Do’s:</strong> Home tasks, small repairs, yard help, moving a couch, assembling that “easy” bookshelf.</li>
          <li><strong>Food:</strong> Share a home-cooked plate, find a hot meal, or give away extras.</li>
          <li><strong>Pets &amp; Paws:</strong> Short walks, foster help, supplies, rides to the vet.</li>
        </ul>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>What’s next</h2>
        <ul style={{ margin: "0 0 0 18px", color: "var(--ink)" }}>
          <li><strong>Ride Share of Good:</strong> Rides to appointments, classes, and interviews.</li>
          <li><strong>Free Tutoring &amp; Mentorship:</strong> Homework help, language practice, career guidance.</li>
          <li><strong>Care Corners:</strong> Wellness check-ins for seniors and new parents.</li>
          <li><strong>Swap &amp; Share:</strong> Tools, books, baby gear—borrow instead of buy.</li>
        </ul>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>How it works</h2>
        <ol style={{ margin: "0 0 0 18px", color: "var(--ink)" }}>
          <li><strong>See or post a need</strong> (or an offer).</li>
          <li><strong>Match locally</strong>—by ZIP and availability.</li>
          <li><strong>Help safely</strong>—simple profiles, messages, and clear expectations.</li>
          <li><strong>Celebrate</strong>—each completed post is a tiny win for your block.</li>
        </ol>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>Our promise</h2>
        <ul style={{ margin: "0 0 0 18px", color: "var(--ink)" }}>
          <li><strong>Free to ask. Free to offer.</strong></li>
          <li><strong>People first.</strong> Clear, simple design that respects your time and privacy.</li>
          <li><strong>Verified kindness.</strong> Community standards to keep interactions safe, generous, and real.</li>
        </ul>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>The bigger picture</h2>
        <p style={{ margin: 0, color: "var(--ink)" }}>
          Kindness scales. A shelf today becomes a study group tomorrow, a job lead next month.
          We’re building a network where generosity is normal and help is near—where neighborhoods
          feel like, well, neighborhoods.
        </p>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, margin: "0 0 6px" }}>Join us</h2>
        <p style={{ margin: 0, color: "var(--ink)" }}>
          Post a need. Offer a hand. Share a meal. Walk a dog. One small act at a time—
          let’s make “I’ve got you” part of everyday life.
        </p>
      </section>
    </main>
  );
}
