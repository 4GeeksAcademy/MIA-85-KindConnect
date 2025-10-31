import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// If we later add Landing.jsx, we have to import Landing from "./pages/Landing and
// make it the index route instead of Home.

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h1>Not found!</h1>,
    children: [
      // Default child at "/"
      { index: true, element: <Home /> },
      { path: "single/:theId", element: <Single /> },
      { path: "demo", element: <Demo /> },
    ],
  },
]);
