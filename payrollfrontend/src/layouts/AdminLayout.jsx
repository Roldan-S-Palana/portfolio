import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar.jsx";
import Navbar from "../components/NavBar.jsx";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update dark mode effect
  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <AdminSidebar />}
      <div className="flex-1 flex flex-col">
        <Navbar
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
