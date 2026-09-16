import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import BrandLoader from "../components/common/BrandLoader";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <BrandLoader fullScreen message="Authenticating session..." />;
  }

  // Check stored credentials if context not yet loaded
  const storedUser = user || JSON.parse(localStorage.getItem("user") || "null");
  const storedToken = token || localStorage.getItem("token");

  if (!storedUser || !storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && storedUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
