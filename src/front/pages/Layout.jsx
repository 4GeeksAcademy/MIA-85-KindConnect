import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export const Layout = () => {
  return (
    <ScrollToTop>
      <Navbar />
      {/* Let each page own its spacing/layout via its own CSS */}
      <main className="layout" id="main" role="main">
        <Outlet />
      </main>
      <Footer />
    </ScrollToTop>
  );
};
