import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import EmployeeLayout from "../layouts/EmployeeLayout";

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  const fetchToday = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/attendance/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const todayRecord = res.data.records.find(
        (r) => format(new Date(r.date), "yyyy-MM-dd") === today
      );

      setAttendance(todayRecord || null);
    } catch (err) {
      toast.error("Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const mark = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const res = await axios.post(
        "http://localhost:3000/api/attendance/mark",
        { type, time: now },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${type === "in" ? "Time In" : "Time Out"} successful`);
      fetchToday(); // refresh
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to mark");
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <EmployeeLayout>
      <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
          Today's Attendance — {today}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-gray-700 dark:text-white">
              <div>
                <strong>Check In:</strong> {attendance?.checkIn || "Not marked"}
              </div>
              <div>
                <strong>Check Out:</strong>{" "}
                {attendance?.checkOut || "Not marked"}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => mark("in")}
                disabled={attendance?.checkIn}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Time In
              </button>
              <button
                onClick={() => mark("out")}
                disabled={!attendance?.checkIn || attendance?.checkOut}
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Time Out
              </button>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeAttendance;
