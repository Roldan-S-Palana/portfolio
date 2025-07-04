  import React, { useState, useEffect } from "react";
  import AdminLayout from "../layouts/AdminLayout";
  import { Building2Icon, PlusIcon, XIcon } from "lucide-react";
  import axios from "axios";
  import { useAuth } from "../context/authContext.jsx";
  import toast from "react-hot-toast";
  import DashboardSkeleton from "../components/Skeleton.jsx";

  const Departments = () => {
    const { user } = useAuth();
    const [allDepartments, setAllDepartments] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newDept, setNewDept] = useState({
      name: "",
      employeeCount: "",
      description: "",
      _id: null,
    });

    // Add Position modal state
    const [showPositionModal, setShowPositionModal] = useState(false);
    const [positionDeptId, setPositionDeptId] = useState(null);
    const [positionForm, setPositionForm] = useState({ name: '', description: '', scope: 'single' });

    // Add Position handler
    const handleAddPosition = (deptId) => {
      setShowPositionModal(true);
      setPositionDeptId(deptId);
      setPositionForm({ name: '', description: '', scope: 'single' });
    };

    const handleSavePosition = async () => {
      if (!positionForm.name) return toast.error('Position name required');
      const token = localStorage.getItem('token');
      try {
        if (positionForm.scope === 'all') {
          // Add to all departments
          const res = await axios.post('http://localhost:3000/api/department/positions/add-to-all',
            { name: positionForm.name, description: positionForm.description },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) {
            setAllDepartments(res.data.departments);
            toast.success('Position added to all departments!');
          }
        } else {
          // Add to single department
          const res = await axios.post(
            `http://localhost:3000/api/department/${positionDeptId}/position`,
            { name: positionForm.name, description: positionForm.description },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) {
            setAllDepartments((prev) =>
              prev.map((d) => (d._id === positionDeptId ? res.data.department : d))
            );
            toast.success('Position added!');
          }
        }
        setShowPositionModal(false);
        setPositionDeptId(null);
        setPositionForm({ name: '', description: '', scope: 'single' });
      } catch (err) {
        toast.error('Failed to add position');
        console.error(err);
      }
    };

    useEffect(() => {
      const fetchDepartments = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            "http://localhost:3000/api/department/all",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.success) {
            setAllDepartments(res.data.departments);
            setDepartments(res.data.departments);
          }
        } catch (err) {
          console.error(
            "Failed to fetch departments:",
            err.response?.data || err
          );
        } finally {
          setLoading(false);
        }
      };

      fetchDepartments();
    }, []);

    useEffect(() => {
      let filtered = allDepartments.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
      let sorted = [...filtered];
      if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "-name") sorted.sort((a, b) => b.name.localeCompare(a.name));
      if (sort === "employeeCount")
        sorted.sort((a, b) => a.employeeCount - b.employeeCount);
      if (sort === "-employeeCount")
        sorted.sort((a, b) => b.employeeCount - a.employeeCount);
      setDepartments(sorted);
      setPage(1);
    }, [search, allDepartments, sort]);

    const handleAddOrUpdate = async () => {
      if (!newDept.name || !newDept.employeeCount) return;

      const token = localStorage.getItem("token");

      try {
        if (editingId) {
          // EDIT mode
          const res = await axios.put(
            `http://localhost:3000/api/department/${editingId}`,
            newDept,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.data.success) {
            const updated = allDepartments.map((d) =>
              d._id === editingId ? res.data.department : d
            );
            setAllDepartments(updated);
            toast.success("Department updated ✅");
          }
        } else {
          // ADD mode
          const res = await axios.post(
            "http://localhost:3000/api/department/add",
            newDept,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.data.success) {
            setAllDepartments([...allDepartments, res.data.department]);
            toast.success("Department added ✅");
          }
        }

        // Reset
        setNewDept({ name: "", employeeCount: "", description: "" });
        setEditingId(null);
        setShowModal(false);
      } catch (err) {
        toast.error("Operation failed ❌");
        console.error(err.response?.data || err);
      }
    };

    const onEdit = (dept) => {
      setNewDept({
        name: dept.name,
        employeeCount: dept.employeeCount,
        description: dept.description || "",
      });
      setEditingId(dept._id); // track for update
      setShowModal(true);
    };

    const onDelete = async (id) => {
      const token = localStorage.getItem("token");
      if (!confirm("Delete this department?")) return;
      try {
        await axios.delete(`http://localhost:3000/api/department/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = allDepartments.filter((d) => d._id !== id);
        setAllDepartments(filtered);
        toast.success("Department deleted!");
      } catch (err) {
        toast.error("Delete failed");
        console.error(err.response?.data || err);
      }
    };

    const paginated = departments.slice((page - 1) * pageSize, page * pageSize);

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

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
            <div className="flex w-full sm:w-2/3 border rounded overflow-hidden dark:border-gray-700">
              <input
                type="text"
                placeholder="Search departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 dark:bg-gray-800 dark:text-white outline-none focus:outline-none focus:ring-2 focus:ring-purple-500
  "
              />
              <select
                onChange={(e) => setSort(e.target.value)}
                value={sort}
                className="px-3 py-2 border-l dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                <option value="name">Name ↑</option>
                <option value="-name">Name ↓</option>
                <option value="employeeCount">Employees ↑</option>
                <option value="-employeeCount">Employees ↓</option>
              </select>
            </div>
          </div>
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map((dept, idx) => (
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
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleAddPosition(dept._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      Add Position
                    </button>
                    <button
                      onClick={() => onEdit(dept)}
                      className="text-purple-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(dept._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  {/* Add Position Modal is handled at the top level, not duplicated here. */}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(departments.length / pageSize) }).map(
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>

          {/* Add Position Modal */}
          {showPositionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">Add Position</h2>
                  <button
                    onClick={() => {
                      setShowPositionModal(false);
                      setPositionDeptId(null);
                      setPositionForm({ name: '', description: '', scope: 'single' });
                    }}
                  >
                    <XIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Position Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                      value={positionForm.name}
                      onChange={e => setPositionForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (optional)</label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                      value={positionForm.description}
                      onChange={e => setPositionForm(f => ({ ...f, description: e.target.value }))}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Add Position To</label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="scope"
                          value="single"
                          checked={positionForm.scope === 'single'}
                          onChange={() => setPositionForm(f => ({ ...f, scope: 'single' }))}
                        />
                        Only this department
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="scope"
                          value="all"
                          checked={positionForm.scope === 'all'}
                          onChange={() => setPositionForm(f => ({ ...f, scope: 'all' }))}
                        />
                        All departments
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      onClick={() => {
                        setShowPositionModal(false);
                        setPositionDeptId(null);
                        setPositionForm({ name: '', description: '', scope: 'single' });
                      }}
                      className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePosition}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                    {editingId ? "Edit Department" : "Add Department"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(false);
                      setNewDept({
                        name: "",
                        employeeCount: "",
                        description: "",
                        _id: null,
                      });
                    }}
                  >
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
                      onClick={handleAddOrUpdate}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      {editingId ? "Update" : "Save"}
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
