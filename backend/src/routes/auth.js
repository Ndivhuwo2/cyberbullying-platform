const express = require('express');
const router = express.Router();
const { register, login, anonymous } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/anonymous', anonymous);

module.exports = router;