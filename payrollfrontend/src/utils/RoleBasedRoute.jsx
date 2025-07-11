import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";


const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default RoleBasedRoute;
