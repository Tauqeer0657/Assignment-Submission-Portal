const express = require("express"); 
const {
  registerUser,
  loginUser,
  uploadAssignment,
  getAdmins,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router(); 

// Route to register a new user
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route to upload an assignment
router.post("/upload", authMiddleware, uploadAssignment);

// Route to get the list of all admins (only usernames)
router.get("/admins", authMiddleware, getAdmins);

module.exports = router; 
