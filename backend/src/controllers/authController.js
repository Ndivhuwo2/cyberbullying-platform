const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

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

module.exports = { register, login, anonymous };