const Admin = require("../models/adminModel");
const Assignment = require("../models/assignmentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Api to register an admin
exports.registerAdmin = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  try {
    // Validate if the required fields are provided or not
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the password meets the minimum length requirement
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin object
    const admin = new Admin({
      username,
      password: hashedPassword,
      role: "Admin", // Default role for admins
    });

    // Save the admin to the database
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error while registering an admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Api for admin login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true, 
      maxAge: 60 * 60 * 1000 
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all assignments tagged to the logged-in admin
exports.getAssignments = async (req, res) => {
  try {
    // Extract the admin's username from the token
    const adminUsername = req.user.username;

    // Find assignments assigned to this admin with a status of 'Pending'
    const assignments = await Assignment.find({
      admin: adminUsername,
      status: "Pending", // Only retrieve assignments that have a 'Pending' status
    });

    // Check if any assignments are found for the admin
    if (!assignments.length) {
      return res.status(404).json({ message: "No pending assignments found for you" });
    }

    // Respond with the list of pending assignments
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments for admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept an assignment by admin
exports.acceptAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const adminUsername = req.user.username; // Get the admin's username from token

    const assignment = await Assignment.findById(assignmentId);

    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if the admin is authorized to accept this assignment
    if (assignment.admin !== adminUsername) {
      return res.status(403).json({ message: "Unauthorized action: Assignment not assigned to you" });
    }

    // Check if the assignment status is "Pending"
    if (assignment.status !== "Pending") {
      return res.status(400).json({ message: "Assignment is not in a 'Pending' state" });
    }

    // Update assignment status to "Accepted"
    assignment.status = "Accepted";
    await assignment.save();

    res.status(200).json({ message: "Assignment accepted successfully", assignment });
  } catch (error) {
    console.error("Error while accepting assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject an assignment by admin
exports.rejectAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const adminUsername = req.user.username; // Get the admin's username from token

    const assignment = await Assignment.findById(assignmentId);

    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if the admin is authorized to reject this assignment
    if (assignment.admin !== adminUsername) {
      return res.status(403).json({ message: "Unauthorized action: Assignment not assigned to you" });
    }

    // Check if the assignment status is "Pending"
    if (assignment.status !== "Pending") {
      return res.status(400).json({ message: "Assignment is not in a 'Pending' state" });
    }

    // Update assignment status to "Rejected"
    assignment.status = "Rejected";
    await assignment.save();

    res.status(200).json({ message: "Assignment rejected successfully", assignment });
  } catch (error) {
    console.error("Error while rejecting assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

