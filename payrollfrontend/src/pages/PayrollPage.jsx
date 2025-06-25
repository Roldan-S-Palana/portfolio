import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";
import { PlusIcon, XIcon } from "lucide-react";

const PayrollPage = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPayroll, setNewPayroll] = useState({
    employeeId: "",
    basic: "",
    allowance: "",
    deduction: "",
    startDate: "",
    endDate: "",
    status: "Unpaid",
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  const fetchPayrolls = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = {
        page,
        limit,
        search,
        status: statusFilter,
        sortField,
        sortOrder,
      };

      const res = await axios.get("http://localhost:3000/api/payroll/all", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setPayrolls(res.data.payrolls || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error("Failed to load payrolls");
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/employee/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.employees || []);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  const createPayroll = async () => {
    try {
      const token = localStorage.getItem("token");
      const basic = parseFloat(newPayroll.basic || 0);
      const allowance = parseFloat(newPayroll.allowance || 0);
      const deduction = parseFloat(newPayroll.deduction || 0);
      const amount = basic + allowance - deduction;

      const payload = {
        employee: newPayroll.employeeId,
        basic,
        allowance,
        deduction,
        amount,
        startDate: newPayroll.startDate,
        endDate: newPayroll.endDate,
        status: newPayroll.status,
      };

      await axios.post("http://localhost:3000/api/payroll", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Payroll created");
      setModalOpen(false);
      setNewPayroll({
        employeeId: "",
        basic: "",
        allowance: "",
        deduction: "",
        startDate: "",
        endDate: "",
        status: "Unpaid",
      });
      fetchPayrolls();
    } catch (err) {
      toast.error("Failed to create payroll");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [search, statusFilter, sortField, sortOrder, page, limit]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Payroll Records</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            <PlusIcon className="w-4 h-4" /> Add Payroll
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded w-full dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500
"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-2 py-2 rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Processing">Processing</option>
            <option value="Paid">Paid</option>
          </select>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-2 py-2 rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="createdAt">Sort by Created</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 px-2 py-2 rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  No payroll records found.
                </td>
              </tr>
            ) : (
              payrolls.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-3">{p.employee?.name}</td>
                  <td className="p-3">{p.startDate?.slice(0, 10)}</td>
                  <td className="p-3">{p.endDate?.slice(0, 10)}</td>
                  <td className="p-3 font-semibold">₱{p.amount?.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : p.status === "Processing"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div>
            Page {pagination.page || 1} of {pagination.totalPages || 1}
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PayrollPage;
