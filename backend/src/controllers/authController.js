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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        is_anonymous: false
      }
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        is_anonymous: user.is_anonymous
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { username }
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
        username: user.username,
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