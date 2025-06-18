import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Building2Icon, PlusIcon, XIcon } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx"
const Departments = () => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([
    {
      name: "Human Resources",
      employeeCount: 5,
      description: "Handles recruitment and employee welfare.",
    },
    {
      name: "IT Department",
      employeeCount: 8,
      description: "Manages tech infrastructure and support.",
    },
    {
      name: "Finance",
      employeeCount: 4,
      description: "Oversees budgeting and financial records.",
    },
    {
      name: "Marketing",
      employeeCount: 6,
      description: "Promotes company brand and services.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    employeeCount: "",
    description: "",
  });

  const handleAdd = async () => {
    if (newDept.name && newDept.employeeCount) {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "http://localhost:3000/api/department/add",
          newDept,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setDepartments([...departments, res.data.department]);
          setNewDept({ name: "", employeeCount: "", description: "" });
          setShowModal(false);
        }
      } catch (err) {
        console.error("Failed to add department:", err.response?.data || err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2Icon className="w-6 h-6 text-purple-500" />
            Departments
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Add Department
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow border dark:border-gray-700 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                {dept.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Employees: {dept.employeeCount}
              </p>
              {dept.description && (
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 italic">
                  {dept.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                  Add Department
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    value={newDept.name}
                    onChange={(e) =>
                      setNewDept({ ...newDept, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    value={newDept.employeeCount}
                    onChange={(e) =>
                      setNewDept({ ...newDept, employeeCount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    value={newDept.description}
                    onChange={(e) =>
                      setNewDept({ ...newDept, description: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAdd}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Save
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

export default Departments;
