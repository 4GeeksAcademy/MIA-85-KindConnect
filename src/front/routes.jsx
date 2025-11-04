

import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import App from "./pages/App";
import FoodHub from "./pages/FoodHub";
import FoodNeedsPage from "./pages/FoodNeedsPage";
import FoodDonationsPage from "./pages/FoodDonationsPage";
import CreateProjectForm from "./pages/CreateProjectForm";
import ProjectDetails from "./pages/ProjectDetails";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="food" element={<FoodHub />}>
        <Route index element={<Navigate to="needs" replace />} />
        <Route path="needs" element={<FoodNeedsPage />} />
        <Route path="donations" element={<FoodDonationsPage />} />
        <Route path="new" element={<CreateProjectForm />} />
      </Route>
      <Route path="projects/:id" element={<ProjectDetails />} />
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}

      <Route path="single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="demo" element={<Demo />} />
    </Route>
  ), {
  future: {
    v7_relativeSplatPath: true
  }
}
);
