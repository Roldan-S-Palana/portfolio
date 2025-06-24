import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../layouts/AdminLayout";
import { XIcon } from "lucide-react";

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

  const fetchPayrolls = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/payroll/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrolls(res.data.payrolls || []);
    } catch {
      toast.error("Failed to load payrolls");
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
      const deduction = parseFloat(newPayroll.deductions || 0);
      const amount = basic + allowance - deduction;

      const payload = {
        employee: newPayroll.employeeId,
        basic,
        allowance,
        deduction,
        amount,
        startDate: newPayroll.startDate,
        endDate: newPayroll.endDate,
        status: "Processing",
      };

      await axios.post("http://localhost:3000/api/payroll", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Payroll created");
      setModalOpen(false);
      fetchPayrolls();
      setNewPayroll({
        employeeId: "",
        basic: "",
        allowance: "",
        deductions: "",
        startDate: "",
        endDate: "",
        status: "",
      });
    } catch (err) {
      toast.error("Failed to create payroll");
      console.error(err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPayrolls();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Payroll Records</h2>
          <button onClick={() => setModalOpen(true)}>Add Payroll</button>
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
            {payrolls.map((p, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-3">{p.employee?.name}</td>
                <td className="p-3">{p.startDate?.slice(0, 10)}</td>
                <td className="p-3">{p.endDate?.slice(0, 10)}</td>
                <td className="p-3 font-semibold">₱{p.amount.toFixed(2)}</td>
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
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  Add Payroll Record
                </h2>
                <button type="button" onClick={() => setModalOpen(false)}>
                  <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee
                  </label>
                  <select
                    value={newPayroll.employeeId}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        employeeId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newPayroll.startDate}
                      onChange={(e) =>
                        setNewPayroll({
                          ...newPayroll,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newPayroll.endDate}
                      onChange={(e) =>
                        setNewPayroll({
                          ...newPayroll,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Basic Salary
                  </label>
                  <input
                    type="number"
                    value={newPayroll.basic}
                    onChange={(e) =>
                      setNewPayroll({ ...newPayroll, basic: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Allowance
                  </label>
                  <input
                    type="number"
                    value={newPayroll.allowance}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        allowance: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deductions
                  </label>
                  <input
                    type="number"
                    value={newPayroll.deduction}
                    onChange={(e) =>
                      setNewPayroll({
                        ...newPayroll,
                        deduction: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={newPayroll.status}
                    onChange={(e) =>
                      setNewPayroll({ ...newPayroll, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={createPayroll}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Save Payroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PayrollPage;
