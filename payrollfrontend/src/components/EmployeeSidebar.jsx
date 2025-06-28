import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CalendarClockIcon,
  CogIcon,
  LogOutIcon,
  FingerprintIcon,
} from "lucide-react";

const links = [
  {
    to: "/employee-dashboard",
    label: "Dashboard",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    to: "/employee-attendance",
    label: "Attendance",
    icon: <FingerprintIcon className="w-5 h-5" />,
  },
  {
    to: "/employee-leave-management",
    label: "Leave Management",
    icon: <CalendarClockIcon className="w-5 h-5" />,
  },
  {
    to: "/employee-payroll",
    label: "Payroll Record",
    icon: <CalendarClockIcon className="w-5 h-5" />,
  },
  {
    to: "/employee-settings",
    label: "Settings",
    icon: <CogIcon className="w-5 h-5" />,
  },
  {
    to: "/logout",
    label: "Logout",
    icon: <LogOutIcon className="w-5 h-5" />,
    danger: true,
  },
];

const EmployeeSidebar = () => {
  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 flex flex-col shadow-lg sticky top-0 z-50">
      <div className="text-2xl font-extrabold font-dmserif mb-8 tracking-tight text-purple-700 dark:text-purple-400">
        Employee Panel
      </div>

      <ul className="space-y-3 flex-1">
        {links.map(({ to, label, icon, danger }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/employee-dashboard"}
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

export default EmployeeSidebar;
