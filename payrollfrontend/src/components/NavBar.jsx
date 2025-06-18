import React, { useState, useRef, useEffect } from "react";
import { MenuIcon, SunIcon, MoonIcon, BellIcon } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode, toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef();

  // Fake notifications
  const notifications = [
    { id: 1, text: "3 leave requests pending" },
    { id: 2, text: "Payroll generated for June" },
    { id: 3, text: "New employee added to IT Dept" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow dark:shadow-md sticky top-0 z-50">
      {/* Left: Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <MenuIcon className="w-5 h-5 text-gray-800 dark:text-white" />
      </button>

      {/* Right: Notifications and Dark Mode */}
      <div className="flex items-center gap-3 relative">
        {/* 🔔 Bell with red dot + bounce */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 animate-bounce" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {/* 🧾 Dropdown List */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <div className="p-2 font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600">
                Notifications
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {notifications.map((note) => (
                  <li
                    key={note.id}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    {note.text}
                  </li>
                ))}
              </ul>
              <div className="p-2 text-xs text-center text-gray-500 dark:text-gray-400">
                {notifications.length === 0 ? "No new notifications" : "View all"}
              </div>
            </div>
          )}
        </div>

        {/* 🌙 Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center"
        >
          {darkMode ? (
            <MoonIcon className="w-4 h-4" />
          ) : (
            <SunIcon className="w-4 h-4" />
          )}
          <span className="ml-1">{darkMode ? "Dark" : "Light"} Mode</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
