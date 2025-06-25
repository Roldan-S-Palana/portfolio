// src/pages/EmployeeDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import EmployeeLayout from "../layouts/EmployeeLayout.jsx";
import {
  CalendarPlusIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FingerprintIcon,
} from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) return;
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user)
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        Loading or unauthorized...
      </div>
    );

  return (
    <EmployeeLayout>
      <div className="text-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-extrabold font-dmserif bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
          Welcome {user.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Here’s your attendance & leave overview:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Days Present",
              value: 20,
              icon: (
                <FingerprintIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              ),
            },
            {
              title: "Leave Applied",
              value: 3,
              icon: (
                <CalendarPlusIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              ),
            },
            {
              title: "Pending Leaves",
              value: 1,
              icon: (
                <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              ),
            },
            {
              title: "Approved Leaves",
              value: 2,
              icon: (
                <CheckCircle2Icon className="w-5 h-5 text-green-500 dark:text-green-400" />
              ),
            },
            {
              title: "Rejected Leaves",
              value: 0,
              icon: (
                <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
              ),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.title}
                </p>
              </div>
              <h2 className="text-2xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">
                {item.value}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
