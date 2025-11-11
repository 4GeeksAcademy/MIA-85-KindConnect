import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";


import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import Landing from "./pages/Landing.jsx";      // homepage
import About from "./pages/About.jsx";          // footer link points here
import Honeydo from "./pages/Honeydo.jsx";      // Honey Do’s
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { ResetPassword } from "./pages/ResetPassword";
// Animals page: default export from Animals.jsx
import Animals from "./pages/Animals";
import ProtectedRoute from "./components/ProtectedRoute";


export const router = createBrowserRouter(
  createRoutesFromElements(
    
    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path= "/landing" element={<Landing />} />
      <Route path="/honeydo" element={<Honeydo />} />
      <Route path="/about" element={<About />} />
      <Route path="/animals" element={ <ProtectedRoute><Animals /></ProtectedRoute>} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />      
      <Route path="/resetPassword" element={<ResetPassword />} />  
    </Route>

  ), {
  future: {
    v7_relativeSplatPath: true
  }}
);
