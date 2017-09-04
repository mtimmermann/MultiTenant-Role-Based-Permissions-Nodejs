const express = require('express');
const router = express.Router();

const authController = require('../main/controllers/authController');

// POST /auth/signup
router.post('/signup', authController.postSignup);

// POST /auth/login
router.post('/login', authController.postLogin);

module.exports = router;
