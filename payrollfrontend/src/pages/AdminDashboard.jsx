import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      // Don't navigate yet, wait for verification to complete
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user)
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        Loading or unauthorized...
      </div>
    );

  return <div className="p-4 text-gray-900 dark:text-gray-100">AdminDashboard: {user.name}</div>;
};

export default AdminDashboard;
