import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
        console.log("🧾 Redirect condition:", { loading, user });
      } else {
        navigate("/employee-dashboard");
        console.log("🧾 Redirect condition:", { loading, user });

      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Submitting login...", { email, password });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json", // ⬅️ force this
          },
        }
      );

      console.log("✅ Login success:", response.data);

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate(
          response.data.user.role === "admin"
            ? "/admin-dashboard"
            : "/employee-dashboard"
        );
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
      setError(
        error.response?.data?.error || "Server error. Check backend logs."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-all duration-300">
      <div
        className="bg-white dark:bg-gray-900 dark:text-white 
        p-8 rounded-2xl shadow-md w-full max-w-sm transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center mb-2 font-dmserif">
          {" "}
          Employee Management System{" "}
        </h2>
        <h2 className="text-xl text-center mb-6 text-gray-600 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null); // clear error on typing
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              focus:ring-purple-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember me + Forgot password */}
          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-700 dark:text-white">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a
              href="#"
              className="text-purple-600 hover:underline dark:text-purple-400"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
