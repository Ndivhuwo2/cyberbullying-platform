const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../utils/prisma');
const { sendPasswordResetEmail } = require('../utils/mailer');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, is_anonymous: user.is_anonymous },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        is_anonymous: false
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        is_anonymous: user.is_anonymous
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        is_anonymous: user.is_anonymous
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const anonymous = async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        is_anonymous: true
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        is_anonymous: user.is_anonymous
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      }
    });

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: 'If that email exists, a reset link has been sent' });

  } catch (error) {
    console.log('Error in forgotPassword:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      }
    });

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all evidence, incidents and cases first, then the user
    await prisma.evidence.deleteMany({
      where: { case: { user_id: userId } }
    });

    await prisma.incident.deleteMany({
      where: { case: { user_id: userId } }
    });

    await prisma.case.deleteMany({
      where: { user_id: userId }
    });

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.log('Error in deleteAccount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login, anonymous, forgotPassword, resetPassword, deleteAccount };