import Employee from "../models/Employee.js";

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch employees" });
  }
};

const addEmployee = async (req, res) => {
  try {
    const { name, position, department, email } = req.body;

    if (!name || !position) {
      return res
        .status(400)
        .json({ success: false, error: "Name and position required" });
    }

    const newEmp = new Employee({
      name,
      position,
      department,
      email,
      image: req.file?.filename,
      createdBy: req.user._id,
    });

    await newEmp.save();
    res.status(201).json({ success: true, employee: newEmp });
    console.log("Uploaded file:", req.file);

  } catch (error) {
    console.error("Add employee error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
export { getAllEmployees, addEmployee };
