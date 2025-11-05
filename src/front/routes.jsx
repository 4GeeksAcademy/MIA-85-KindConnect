import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";


import { Layout } from "./pages/Layout";


import Landing from "./pages/Landing.jsx";      // homepage
import About from "./pages/About.jsx";          // footer link points here
import Honeydo from "./pages/Honeydo.jsx";      // Honey Do’s
import FoodHub from "./pages/FoodHub";
import FoodNeedsPage from "./pages/FoodNeedsPage";
import FoodDonationsPage from "./pages/FoodDonationsPage";
import CreateProjectForm from "./pages/CreateProjectForm";
import ProjectDetails from "./pages/ProjectDetails";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* HOME = Landing page */}
      <Route index element={<Landing />} />

      {/* Honey Do’s */}
      <Route path="honeydo" element={<Honeydo />} />

      {/* About (linked from footer) */}
      <Route path="about" element={<About />} />

      {/* Food hub (kept as in your original) */}
      <Route path="food" element={<FoodHub />}>
        <Route index element={<Navigate to="needs" replace />} />
        <Route path="needs" element={<FoodNeedsPage />} />
        <Route path="donations" element={<FoodDonationsPage />} />
        <Route path="new" element={<CreateProjectForm />} />
      </Route>

      {/* Project details */}
      <Route path="projects/:id" element={<ProjectDetails />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  ),
  {
    future: { v7_relativeSplatPath: true },
  }
);
