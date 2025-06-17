import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // this clears user + token
    navigate("/login");
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
