const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const router = express.Router();

// Route to register a new admin
router.post("/register", registerAdmin);

// Route for admin login
router.post("/login", loginAdmin);

// Route to fetch all assignments for the logged-in admin
router.get(
  "/assignments",
  authMiddleware, 
  authorizationMiddleware(["Admin"]),
  getAssignments
);

// Route to accept an assignment by its ID
router.post(
  "/assignments/:id/accept",
  authMiddleware, 
  authorizationMiddleware(["Admin"]),
  acceptAssignment
);

// Route to reject an assignment by its ID
router.post(
  "/assignments/:id/reject",
  authMiddleware, 
  authorizationMiddleware(["Admin"]),
  rejectAssignment
);

module.exports = router; 
