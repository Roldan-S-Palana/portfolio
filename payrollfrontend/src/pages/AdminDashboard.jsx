
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import React from 'react';
import { useAuth } from '../context/authContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.name}</h1>
          <p>Your role: {user.role}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login.</p>
      )}
    </div>
  );
}

export default Dashboard;
