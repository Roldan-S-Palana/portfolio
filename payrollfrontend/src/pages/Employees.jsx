// Template to start your Employees page
import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { UsersIcon, PlusIcon, XIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Combobox } from "@headlessui/react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const safeSearch = (search || "").toLowerCase();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/department/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setDepartments(res.data.departments); // assuming each has `.name`
        }
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };

    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/employee/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      toast.error("Failed to fetch employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const paginated = employees

    .filter(
      (e) =>
        (e.name || "").toLowerCase().includes(safeSearch) ||
        (e.position || "").toLowerCase().includes(safeSearch) ||
        (e.department || "").toLowerCase().includes(safeSearch)
    )
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "-name") return b.name.localeCompare(a.name);
      return 0;
    })
    .slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const handleSubmit = async () => {
    if (!newEmployee.name || !newEmployee.position) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newEmployee.name);
      formData.append("position", newEmployee.position);
      formData.append("department", newEmployee.department);
      formData.append("email", newEmployee.email);
      if (newEmployee.image) {
        formData.append("image", newEmployee.image);
      }

      if (isEditing) {
        const res = await axios.put(
          `http://localhost:3000/api/employee/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          setEmployees((prev) =>
            prev.map((e) => (e._id === editId ? res.data.employee : e))
          );
          toast.success("Employee updated ✅");
        }
      } else {
        const res = await axios.post(
          "http://localhost:3000/api/employee/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.success) {
          setEmployees((prev) => [...prev, res.data.employee]);
          toast.success("Employee added ✅");
        }
      }

      setShowModal(false);
      setNewEmployee({
        name: "",
        position: "",
        department: "",
        email: "",
        image: null,
      });
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      toast.error(isEditing ? "Update failed" : "Add failed");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:3000/api/employee/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setEmployees((prev) => prev.filter((e) => e._id !== id));
        toast.success("Employee deleted");
      }
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-purple-600" /> Employees
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            <PlusIcon className="w-4 h-4" /> Add Employee
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
          <div className="flex w-full sm:w-2/3 border rounded overflow-hidden dark:border-gray-700">
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 dark:bg-gray-800 dark:text-white outline-none"
            />
            <select
              onChange={(e) => setSort(e.target.value)}
              value={sort}
              className="px-3 py-2 border-l dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="name">Name ↑</option>
              <option value="-name">Name ↓</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading employees...</p>
          ) : (
            paginated.map((emp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow border dark:border-gray-700 hover:shadow-md transition"
              >
                {/* 🖼️ Image block */}
                <div className="flex justify-center mb-2">
                  {emp.profileImage ? (
                    <img
                      src={`http://localhost:3000/uploads/${emp.profileImage}`}
                      alt={emp.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-600"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                      No Photo
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-700">
                  {emp.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Position: {emp.position}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Department: {emp.department}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  Email: {emp.email}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setNewEmployee({
                        name: emp.name,
                        position: emp.position,
                        department: emp.department,
                        email: emp.email,
                        image: null,
                      });
                      setEditId(emp._id);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {employees.length > pageSize && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(employees.length / pageSize) }).map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                  Add Employee
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        image: e.target.files[0],
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        position: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <Combobox
                    value={newEmployee.department}
                    onChange={(value) =>
                      setNewEmployee({ ...newEmployee, department: value })
                    }
                  >
                    <div className="relative">
                      <Combobox.Input
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                        placeholder="Type or select department"
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            department: e.target.value,
                          })
                        }
                        displayValue={(value) => value}
                      />
                      <Combobox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                        {departments
                          .filter((dept) =>
                            dept.name
                              .toLowerCase()
                              .includes(
                                (newEmployee.department || "").toLowerCase()
                              )
                          )
                          .map((dept) => (
                            <Combobox.Option
                              key={dept._id}
                              value={dept.name}
                              className={({ active }) =>
                                `cursor-pointer px-4 py-2 ${
                                  active
                                    ? "bg-purple-600 text-white"
                                    : "text-gray-900 dark:text-white"
                                }`
                              }
                            >
                              {dept.name}
                            </Combobox.Option>
                          ))}
                        {!departments.some(
                          (d) => d.name === newEmployee.department
                        ) &&
                          newEmployee.department && (
                            <Combobox.Option
                              value={newEmployee.department}
                              className="cursor-pointer px-4 py-2 text-purple-600"
                            >
                              Add “{newEmployee.department}”
                            </Combobox.Option>
                          )}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSubmit}
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

export default Employees;
