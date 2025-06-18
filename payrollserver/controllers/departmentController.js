import Department from "../models/Department.js"; // You must create this model

const addDepartment = async (req, res) => {
  try {
    const { name, employeeCount, description } = req.body;

    if (!name || employeeCount == null) {
      return res
        .status(400)
        .json({ success: false, error: "Name and employeeCount are required" });
    }

    const newDept = new Department({
      name,
      employeeCount,
      description,
      createdBy: req.user._id, // Optional: track creator
    });

    await newDept.save();

    return res.status(201).json({ success: true, department: newDept });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "add department server error" });
  }
};
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch departments" });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { name, employeeCount, description } = req.body;
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name, employeeCount, description },
      { new: true }
    );
    res.json({ success: true, department: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
};

export { addDepartment, getDepartments,  deleteDepartment, updateDepartment};
