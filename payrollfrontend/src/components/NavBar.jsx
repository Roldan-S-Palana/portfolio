// src/components/Navbar.jsx
import React from "react";
import { MenuIcon, SunIcon, MoonIcon } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode, toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow dark:shadow-md">
      {/* Left: Burger */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MenuIcon className="w-5 h-5 text-gray-800 dark:text-white" />
      </button>

      {/* Right: Dark Toggle */}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="p-2 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? (
          <MoonIcon className="w-4 h-4 inline" />
        ) : (
          <SunIcon className="w-4 h-4 inline" />
        )}
        <span className="ml-1">{darkMode ? "Dark" : "Light"} Mode</span>
      </button>
    </header>
  );
};

export default Navbar;
    