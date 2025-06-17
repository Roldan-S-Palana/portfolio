import { Routes, Route } from "react-router-dom"; // no BrowserRouter here
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import NotFound from "./pages/NotFound.jsx"; // create this page
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import RoleBasedRoute from "./utils/RoleBasedRoute.jsx";
import Logout from "./pages/Logout.jsx"; // ⬅️ Make sure this is imported

function App() {
  // const [darkMode, setDarkMode] = useState(() => {
  //   const savedTheme = localStorage.getItem("theme");
  //   if (savedTheme) return savedTheme === "dark";

  //   const prefersDark = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   ).matches;
  //   return prefersDark;
  // });

  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [darkMode]);

  console.log("Rendering App.jsx");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all duration-300 bg-light dark:bg-dark bg-cover bg-center">
      {/* Wish #1: Toggle Button
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div> */}

      {/* Routing */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {/*Protected Routes*/}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"admin"}>
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"employee"}>
                <EmployeeDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} /> {/* catch-all */}
      </Routes>
    </div>
  );
}

export default App;
