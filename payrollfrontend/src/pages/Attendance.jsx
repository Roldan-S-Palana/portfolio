import React, { useEffect, useState } from "react";
import axios from "axios";
import { DownloadIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.attendance || []);
    } catch (err) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csv = records
      .map((r) => `${r.employee.name},${r.date},${r.clockIn},${r.clockOut}`)
      .join("\n");
    const blob = new Blob(["Name,Date,In,Out\n" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };

  const filtered = records
    .filter((r) => r.employee.name.toLowerCase().includes(search.toLowerCase()))
    .slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg w-64 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={exportCSV}
            className="flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <DownloadIcon className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Clock In</th>
              <th className="p-3">Clock Out</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-3">{r.employee.name}</td>
                <td className="p-3">{format(new Date(r.date), "PPP")}</td>
                <td className="p-3">{r.clockIn || "N/A"}</td>
                <td className="p-3">{r.clockOut || "N/A"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      r.clockOut
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {r.clockOut ? "Complete" : "Ongoing"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(records.length / pageSize) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Attendance;
