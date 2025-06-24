import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon, XIcon, DownloadIcon } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import AdminLayout from "../layouts/AdminLayout";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/leaves/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves || []);
    } catch (err) {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/api/leaves/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Leave ${status}`);
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update leave");
    }
  };

  const exportCSV = () => {
    const csv = leaves.map(l =>
      `${l.employee.name},${l.type},${l.from},${l.to},${l.status}`
    ).join("\n");
    const blob = new Blob(["Name,Type,From,To,Status\n" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaves.csv";
    a.click();
  };

  return (
    <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Leave Requests</h2>
            <button
              onClick={exportCSV}
              className="flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <DownloadIcon className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Type</th>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, idx) => (
                <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3">{l.employee.name}</td>
                  <td className="p-3">{l.type}</td>
                  <td className="p-3">{format(new Date(l.from), "PPP")}</td>
                  <td className="p-3">{format(new Date(l.to), "PPP")}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      l.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : l.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(l._id, "approved")}
                      className="text-green-600 hover:underline"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateStatus(l._id, "rejected")}
                      className="text-red-600 hover:underline"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </AdminLayout>
  );
};

export default LeaveManagement;
