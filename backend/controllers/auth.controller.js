// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNo, department, isLeader, role } = req.body;

    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (role === 'student' && !rollNo) {
      return res.status(400).json({ message: 'Roll number is required for students.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      rollNo: role === 'student' ? rollNo : null,
      department,
      isLeader,
      role,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
