const express = require('express');
const router = express.Router();
const { register, login, anonymous, forgotPassword, resetPassword, deleteAccount } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

router.post('/register', register);
router.post('/login', login);
router.post('/anonymous', anonymous);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/account', authenticate, deleteAccount);

module.exports = router;