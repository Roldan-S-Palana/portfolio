import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import DashboardSkeleton from "../components/Skeleton";
import EmployeeLayout from "../layouts/EmployeeLayout";

const EmployeePayslipPage = () => {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/payroll/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setPayrolls(res.data.payrolls);
        }
      } catch (err) {
        console.error("Failed to fetch payrolls:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrolls();
  }, []);

  return (
    <EmployeeLayout>
      <div className="p-6 text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-4">My Payslips</h1>
        {loading ? (
          <DashboardSkeleton />
        ) : payrolls.length === 0 ? (
          <p>No payroll records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="border p-2">Period</th>
                  <th className="border p-2">Basic</th>
                  <th className="border p-2">Allowance</th>
                  <th className="border p-2">Deduction</th>
                  <th className="border p-2">Net Pay</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((pay, i) => (
                  <tr key={i} className="text-center">
                    <td className="border p-2">
                      {new Date(pay.startDate).toLocaleDateString()} -{" "}
                      {new Date(pay.endDate).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      ₱{pay.basic.toLocaleString()}
                    </td>
                    <td className="border p-2">
                      ₱{pay.allowance.toLocaleString()}
                    </td>
                    <td className="border p-2">
                      ₱{pay.deduction.toLocaleString()}
                    </td>
                    <td className="border p-2 font-semibold text-green-600">
                      ₱{pay.amount.toLocaleString()}
                    </td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          pay.status === "Paid"
                            ? "bg-green-600"
                            : pay.status === "Processing"
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeePayslipPage;
