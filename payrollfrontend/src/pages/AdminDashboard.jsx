import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import AdminLayout from "../layouts/AdminLayout.jsx";
import {
  UsersIcon,
  Building2Icon,
  WalletIcon,
  CalendarPlusIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      // Don't navigate yet, wait for verification to complete
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user)
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        Loading or unauthorized...
      </div>
    );

  return (
    <AdminLayout>
      <div className="text-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-extrabold font-dmserif bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Welcome Admin {user.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Here’s your overview for the month:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            
              {
                title: "Total Employees",
                value: 42,
                icon: (
                  <UsersIcon className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                ),
              },
              {
                title: "Departments",
                value: 5,
                icon: (
                  <Building2Icon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                ),
              },
              {
                title: "Monthly Payroll",
                value: "₱150,000",
                icon: (
                  <WalletIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                ),
              },
              {
                title: "Leave Applied",
                value: 10,
                icon: (
                  <CalendarPlusIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                ),
              },
              {
                title: "Leave Pending",
                value: 3,
                icon: (
                  <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                ),
              },
              {
                title: "Leave Approved",
                value: 6,
                icon: (
                  <CheckCircle2Icon className="w-5 h-5 text-green-500 dark:text-green-400" />
                ),
              },
              {
                title: "Leave Rejected",
                value: 1,
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
              <h2 className="text-2xl font-bold mt-1 text-pink-600 dark:text-pink-400">
                {item.value}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-8 space-y-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 rounded shadow text-gray-800 dark:text-white"
          >
            Dummy content block #{i + 1}
          </div>
        ))}
      </div> */}
    </AdminLayout>
  );
};

export default AdminDashboard;
