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

export { addDepartment };
