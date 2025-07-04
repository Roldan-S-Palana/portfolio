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
    const { name, employeeCount, description, head } = req.body;

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name, employeeCount, description, head },
      { new: true }
    );

    res.json({ success: true, department: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
};


// Add position to a single department
const addPositionToDepartment = async (req, res) => {
  try {
    const { id } = req.params; // department ID
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Position name is required" });
    }

    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    // Avoid duplicate position names
    if (!dept.positions.some(pos => pos.name === name)) {
      dept.positions.push({ name, description });
      await dept.save();
    }

    res.json({ success: true, department: dept });
  } catch (error) {
    console.error("Error adding position:", error);
    res.status(500).json({ success: false, error: "Failed to add position" });
  }
};

// Add position to all departments
const addPositionToAllDepartments = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Position name is required" });
    }
    const departments = await Department.find();
    let updatedDepartments = [];
    for (let dept of departments) {
      if (!dept.positions.some(pos => pos.name === name)) {
        dept.positions.push({ name, description });
        await dept.save();
      }
      updatedDepartments.push(dept);
    }
    res.json({ success: true, departments: updatedDepartments });
  } catch (error) {
    console.error("Error adding position to all departments:", error);
    res.status(500).json({ success: false, error: "Failed to add position to all departments" });
  }
};

export {
  addDepartment,
  getDepartments,
  deleteDepartment,
  updateDepartment,
  addPositionToDepartment,
  addPositionToAllDepartments,
};
