import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // ✅ Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Safe check for role
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise allow access
  return children;
};

export default ProtectedRoute;
