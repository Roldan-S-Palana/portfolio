import React, { useEffect, useState } from "react";
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
import axios from "axios";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");
  const [range, setRange] = useState("this_month");

  useEffect(() => {
    if (user === null) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/admin-dashboard?range=${range}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(res.data.stats);
      } catch (error) {
        console.error("❌ Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, [user, range, navigate]);

  if (!user || !stats) {
    return (
      <div className="p-4 text-gray-900 dark:text-gray-100">
        Loading dashboard...
      </div>
    );
  }

  const dashboardItems = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: <UsersIcon className="w-5 h-5 text-pink-500 dark:text-pink-400" />,
    },
    {
      title: "Departments",
      value: stats.departments,
      icon: (
        <Building2Icon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
      ),
    },
    {
      title:
        range === "this_month"
          ? "Monthly Payroll"
          : range === "last_3_months"
          ? "Last 3 Months Payroll"
          : "Total Payroll",
      value: `₱${Number(stats.totalPayroll).toLocaleString()}`,
      icon: (
        <WalletIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
      ),
    },
    {
      title: "Leave Applied",
      value: stats.leaveApplied,
      icon: (
        <CalendarPlusIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
      ),
    },
    {
      title: "Leave Pending",
      value: stats.leavePending,
      icon: <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />,
    },
    {
      title: "Leave Approved",
      value: stats.leaveApproved,
      icon: (
        <CheckCircle2Icon className="w-5 h-5 text-green-500 dark:text-green-400" />
      ),
    },
    {
      title: "Leave Rejected",
      value: stats.leaveRejected,
      icon: <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="text-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-extrabold font-dmserif bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
          Welcome {user.name}!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Here’s your overview for the month:
        </p>

        <select
          className="mb-4 p-2 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="this_month">This Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="all">All Time</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {dashboardItems.map((item, idx) => (
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
    </AdminLayout>
  );
};

export default AdminDashboard;
