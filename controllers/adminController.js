const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin registration
exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({
      username,
      password: hashedPassword,
      role: 'Admin', // Assigning the Admin role
    });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await User.findOne({ username });
    if (!admin || admin.role !== 'Admin') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all assignments tagged to the logged-in admin
exports.getAssignments = async (req, res) => {
  try {
    const adminUsername = req.user.username; // Get the admin's username from the JWT
    const assignments = await Assignment.find({ admin: adminUsername });

    if (!assignments.length) {
      return res.status(404).json({ message: 'No assignments found for this admin' });
    }

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept an assignment
exports.acceptAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'Accepted';
    await assignment.save();

    res.json({ message: 'Assignment accepted successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject an assignment
exports.rejectAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'Rejected';
    await assignment.save();

    res.json({ message: 'Assignment rejected successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
