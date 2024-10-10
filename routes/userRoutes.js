const express = require('express');
const { registerUser, loginUser, uploadAssignment, getAdmins } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload', authMiddleware, uploadAssignment);
router.get('/admins', authMiddleware, getAdmins);

module.exports = router;
