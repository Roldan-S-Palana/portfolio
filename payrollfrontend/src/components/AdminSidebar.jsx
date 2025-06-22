// src/components/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  CalendarClockIcon,
  CogIcon,
  LogOutIcon,
  BuildingIcon,
  FingerprintIcon,
  FileTextIcon,
} from "lucide-react"; // uses lucide-react for modern icons

const links = [
  {
    to: "/admin-dashboard",
    label: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    to: "/admin-dashboard/employees",
    label: "Employees",
    icon: <UsersIcon className="w-5 h-5" />,
  },
  {
    to: "/admin-dashboard/departments",
    label: "Departments",
    icon: <BuildingIcon className="w-5 h-5" />,
  },
  {
    to: "/payroll",
    label: "Payroll",
    icon: <CreditCardIcon className="w-5 h-5" />,
  },
  {
    to: "/attendace",
    label: "Attendance",
    icon: <FingerprintIcon className="w-5 h-5" />,
  },
  {
    to: "/leaves",
    label: "Leave Management",
    icon: <CalendarClockIcon className="w-5 h-5" />,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: <FileTextIcon className="w-5 h-5" />,
  },
  { to: "/settings", label: "Settings", icon: <CogIcon className="w-5 h-5" /> },
  {
    to: "/logout",
    label: "Logout",
    icon: <LogOutIcon className="w-5 h-5" />,
    danger: true,
  },
];

const AdminSidebar = () => {
  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 flex flex-col shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-extrabold font-dmserif mb-8 tracking-tight text-purple-700 dark:text-purple-400">
        Admin Panel
      </div>

      <ul className="space-y-3 flex-1">
        {links.map(({ to, label, icon, danger }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/admin-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200
                ${
                  isActive
                    ? "bg-gray-200 dark:bg-gray-800 text-violet-700 dark:text-violet-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-fuchsia-600 dark:hover:text-fuchsia-400"
                }

                ${danger ? "hover:text-red-400" : ""}`
              }
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} YourCompany
      </div>
    </div>
  );
};

export default AdminSidebar;
