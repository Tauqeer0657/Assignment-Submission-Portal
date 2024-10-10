const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      role: 'User', // Default role for users
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload assignment
exports.uploadAssignment = async (req, res) => {
  const { task, admin } = req.body;
  const userId = req.user.username; // Extract the user's username from the JWT

  try {
    const assignment = new Assignment({
      userId,
      task,
      admin,
      status: 'Pending',
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment uploaded successfully', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'Admin' }, { username: 1, _id: 0 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
