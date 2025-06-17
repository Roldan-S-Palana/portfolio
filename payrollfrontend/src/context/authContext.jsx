import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      console.log("🔎 Verifying user...");
      try {
        const token = localStorage.getItem("token");
        console.log("📦 Token from localStorage:", token);

        if (token) {
          const response = await axios.get(
            "http://localhost:3000/api/auth/verify",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("✅ Verification response:", response.data);

          if (response.data.success) {
            setUser(response.data.user);
            console.log("👤 User set:", response.data.user);
          } else {
            console.log("❌ Verification failed:", response.data);
            setUser(null);
          }
        } else {
          console.log("⚠️ No token found.");
          setUser(null);
        }
      } catch (error) {
        console.error("❗ Error during verification:", error);
        setUser(null);
      } finally {
        console.log("✅ Finished verification, setting loading to false");
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData) => {
    console.log("🔐 Logging in user:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    console.log("🚪 Logging out");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
export default AuthProvider;
