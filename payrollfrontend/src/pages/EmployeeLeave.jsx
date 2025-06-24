// src/pages/EmployeeLeave.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { format } from "date-fns";

const EmployeeLeave = () => {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchLeaveHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/leaves/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.leaves);
    } catch (err) {
      toast.error("Failed to load leave history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !startDate || !endDate) {
      return toast.error("All fields are required");
    }
    try {
      await axios.post(
        "http://localhost:3000/api/leaves/apply",
        { reason, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Leave request submitted");
      setReason("");
      setStartDate("");
      setEndDate("");
      fetchLeaveHistory();
    } catch (err) {
      toast.error("Failed to submit leave request");
    }
  };

  return (
    <EmployeeLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
          Leave Application
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-500">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Leave
          </button>
        </form>

        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
          Leave History
        </h3>

        {loading ? (
          <p>Loading leave history...</p>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-3">Reason</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((leave, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-3">{leave.reason}</td>
                  <td className="p-3">
                    {format(new Date(leave.startDate), "PPP")}
                  </td>
                  <td className="p-3">
                    {format(new Date(leave.endDate), "PPP")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : leave.status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeLeave;
