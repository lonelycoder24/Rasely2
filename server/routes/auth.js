const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Verify ID token endpoint (client can post idToken to get basic user info)
router.post('/verify', authController.verify);

module.exports = router;
