import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const ProtectedRoute = ({ children }) => {
  const { store } = useGlobalReducer();

  // fallback to localStorage if token not in global state
  const token = store.token || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
