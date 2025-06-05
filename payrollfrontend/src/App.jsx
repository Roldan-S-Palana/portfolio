import React, { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';

function App() {
  // Wish #2 + #3: Load saved theme or detect system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
  });

  // Apply dark class and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-300">
      <BrowserRouter>
        {/* Wish #1: Toggle Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        {/* Routing */}
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}/>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />}/>
        </Routes>
      </BrowserRouter>
    <h1 className="text-4xl text-red-500">Hello, Vite + React is working!</h1>
    </div>
  );
  console.log("Rendering App.jsx");

}

export default App;

