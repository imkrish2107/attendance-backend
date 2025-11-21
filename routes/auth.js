const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, managerId } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashed,
      role: role || 'employee',
      managerId: managerId || null
    });

    res.json({ ok: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ ok: true, token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
