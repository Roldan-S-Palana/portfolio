import React from 'react';
import { Link } from 'react-router-dom';

const funnyMessages = [
  "You seem lost... like a Magikarp on land 🐟",
  "404 - Just like your will to finish that side project 💀",
  "Oops! This page took an arrow to the knee 🏹",
  "You're off the map, like a Zubat in daylight 🦇",
  "This page is more empty than your bank account after Steam sales 🤑",
  "Well… this isn't the PokéCenter 😵‍💫",
  "Are you trying to hack the Matrix? 🕶️💊",
];

const gifURLs = [
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", // Confused Travolta
  "https://media.giphy.com/media/f7Qy1fKf3gGKs/giphy.gif",      // Derp Cat
  "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif", // Pikachu shock
  "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif", // Facepalm
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",  // Math lady
  "https://media.giphy.com/media/SsTcO55LJDBsI/giphy.gif",      // Magikarp flop
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const NotFound = () => {
  const message = getRandomItem(funnyMessages);
  const gif = getRandomItem(gifURLs);

  const handleFakeCalc = (e) => {
    e.preventDefault();
    alert("42. Always 42. 🔢 (Maths are fake)");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-black dark:text-white px-4 text-center">
      <img
        src={gif}
        alt="Random chaos"
        className="w-64 mb-6 rounded shadow-lg"
      />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found 😵</h1>
      <p className="mb-6 text-lg">{message}</p>

      {/* 🔢 Fake calculator */}
      <form onSubmit={handleFakeCalc} className="mb-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="First number"
            className="p-2 border rounded text-black"
          />
          <input
            type="number"
            placeholder="Second number"
            className="p-2 border rounded text-black"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          = Calculate (badly)
        </button>
      </form>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🏠 Back to Safety
      </Link>
    </div>
  );
};

export default NotFound;
