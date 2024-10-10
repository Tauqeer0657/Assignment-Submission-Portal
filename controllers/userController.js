const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Assignment = require("../models/assignmentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Api to register a user
exports.registerUser = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  try {
    // Validate if the required fields are provided or not
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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

    // Create a new user object
    const user = new User({
      username,
      password: hashedPassword,
      role: "User", // Default role for users
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error while registering a user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Api for user login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id,
        username: user.username,
        role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    res.cookie('token', token, {
      httpOnly: true, 
      maxAge: 60 * 60 * 1000 
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error while logging the user" });
  }
};

// Api to upload assignment by user
exports.uploadAssignment = async (req, res) => {
  const { task, admin } = req.body;

  // Extract the user's username from the request object 
  const userId = req.user.username;  

  try {
    // Check if the admin exists
    const existingAdmin = await Admin.findOne({ username: admin });
    if (!existingAdmin) {
      return res.status(400).json({ message: "Provided admin does not exist please check again" });
    }

    // Create a new assignment object
    const assignment = new Assignment({
      userId,
      task,
      admin,  
      status: "Pending",
    });

    // Save an assignment in the database
    await assignment.save();
    res.status(201).json({ message: "Assignment uploaded successfully", assignment });
  } catch (error) {
    console.error('Error while uploading assignment:', error);
    res.status(500).json({ message: "Error while uploading an assignment" });
  }
};

// Api to fetch all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { username: 1, _id: 0 });

    // Check if no admins are found
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }

    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching admin usernames" });
  }
};

