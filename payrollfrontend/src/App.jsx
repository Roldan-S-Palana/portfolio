import { Routes, Route } from "react-router-dom"; // no BrowserRouter here
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import NotFound from "./pages/NotFound.jsx"; // create this page
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import RoleBasedRoute from "./utils/RoleBasedRoute.jsx";
import Logout from "./pages/Logout.jsx"; // ⬅️ Make sure this is imported
import Departments from "./pages/Departments.jsx";
import { Toaster } from "react-hot-toast";
import Employees from "./pages/Employees.jsx";
import LeaveManagement from "./pages/LeaveManagement.jsx";
import Attendance from "./pages/Attendance.jsx";
import EmployeeAttendance from "./pages/EmployeeAttendance.jsx";
import EmployeeLeave from "./pages/EmployeeLeave.jsx";
import PayrollPage from "./pages/PayrollPage";
import EmployeePayslipPage from "./pages/EmployeePayroll.jsx";
<Toaster />;
function App() {
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
          path="/payroll"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"admin"}>
                <PayrollPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/department"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"admin"}>
                <Departments />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"admin"}>
                <Employees />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"admin"}>
                <Attendance />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-management"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"admin"}>
                <LeaveManagement />
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
        <Route
          path="/employee-attendance"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"employee"}>
                <EmployeeAttendance />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-leave-management"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"employee"}>
                <EmployeeLeave />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
         <Route
          path="/employee-payroll"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"employee"}>
                <EmployeePayslipPage />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-settings"
          element={
            <ProtectedRoute>
              <RoleBasedRoute requiredRole={"employee"}>
                <EmployeeAttendance />
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
