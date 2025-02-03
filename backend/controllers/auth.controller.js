// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNo, department, staffId, primaryRole, isLeader, secondaryRoles } = req.body;

    // Basic required fields check
    if (!name || !email || !password || !primaryRole || !department) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // RollNo is required for students
    if (primaryRole === 'student' && !rollNo) {
      return res.status(400).json({ message: 'Roll number is required for students.' });
    }

    // StaffId is required for non-student roles
    if (primaryRole !== 'student' && !staffId) {
      return res.status(400).json({ message: 'Staff ID is required for non-student roles.' });
    }

    // SecondaryRoles must be empty if the primary role is student
    if (primaryRole === 'student' && secondaryRoles && secondaryRoles.length > 0) {
      return res.status(400).json({ message: 'Students cannot have secondary roles.' });
    }

    // isLeader must be false for teacher, ac, tutor, or hod
    if (['teacher', 'ac', 'tutor', 'hod'].includes(primaryRole) && isLeader === true) {
      return res.status(400).json({ message: 'isLeader cannot be true for teacher, tutor, ac, or hod.' });
    }

    // Check if user already exists with the same email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      rollNo: primaryRole === 'student' ? rollNo : null,
      staffId: primaryRole !== 'student' ? staffId : null,
      department,
      primaryRole,
      isLeader: primaryRole === 'student' ? isLeader : false,  // Students can be leaders, others cannot
      secondaryRoles: primaryRole !== 'student' ? secondaryRoles : [], // Only non-students can have secondary roles
    });

    // Save user to the database
    await newUser.save();

    // Respond with created user details
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      primaryRole: newUser.primaryRole,
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
      primaryRole: user.primaryRole,
      secondaryRoles: user.secondaryRoles,
      isLeader: user.isLeader,
      isAdmin: user.isAdmin,  // Make sure this is included
      token: generateToken(user._id),
  });
  
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

