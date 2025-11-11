import React from "react";

export default function About() {
  return (
    <main className="layout" style={{padding:"24px 16px", maxWidth:800, margin:"0 auto"}}>
      <h1 style={{fontWeight:800, marginBottom:8}}>About us</h1>
      <p style={{color:"var(--muted)"}}> 
        just demo, 
        KindConnect was made with a lot of love to help others with acts of service—free, neighbor to neighbor.
        Need help around the house or want to help someone fix their sink? KindConnect.
        Need volunteers or want to adopt? KindConnect.
        Have extra home-cooked food or made too much? KindConnect.
        If you’d like to volunteer for rides or other needs, we’d love to hear from you!
      </p>
    </main>
  );
}
