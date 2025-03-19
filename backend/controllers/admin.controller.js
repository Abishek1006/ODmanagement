const User = require('../models/user.model');
const Course = require('../models/course.model');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// User Management
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  
  let query = {};
  
  // If role is specified, filter by that role
  if (role) {
    query = { 
      $or: [
        { primaryRole: role },
        { secondaryRoles: role }
      ]
    };
  }
  
  const users = await User.find(query)
    .select('-password')
    .populate('tutorId', 'name department')
    .populate('acId', 'name department')
    .populate('hodId', 'name department');
    
  res.json(users);
});

exports.createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    primaryRole,
    secondaryRoles,
    department,
    semester,
    staffId,
    rollNo,
    isLeader,
    tutorId,
    acId,
    hodId
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Check for duplicate staff ID if provided
  if (staffId) {
    const staffIdExists = await User.findOne({ staffId });
    if (staffIdExists) {
      res.status(400);
      throw new Error('Staff ID already exists');
    }
  }

  // Check for duplicate roll number if provided
  if (rollNo) {
    const rollNoExists = await User.findOne({ rollNo });
    if (rollNoExists) {
      res.status(400);
      throw new Error('Roll number already exists');
    }
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    primaryRole,
    secondaryRoles: secondaryRoles || [],
    department,
    semester: primaryRole === 'student' ? semester : undefined,
    staffId: primaryRole !== 'student' ? staffId : undefined,
    rollNo: primaryRole === 'student' ? rollNo : undefined,
    isLeader: primaryRole === 'student' ? isLeader : false,
    tutorId: tutorId || undefined,
    acId: acId || undefined,
    hodId: hodId || undefined
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    primaryRole: user.primaryRole,
    department: user.department
  });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const {
    name,
    email,
    password,
    primaryRole,
    secondaryRoles,
    department,
    semester,
    staffId,
    rollNo,
    isLeader,
    tutorId,
    acId,
    hodId
  } = req.body;

  // Check if email is being changed and if it already exists
  if (email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already in use');
    }
  }

  // Check if staffId is being changed and if it already exists
  if (staffId && staffId !== user.staffId) {
    const staffIdExists = await User.findOne({ staffId });
    if (staffIdExists) {
      res.status(400);
      throw new Error('Staff ID already exists');
    }
  }

  // Check if rollNo is being changed and if it already exists
  if (rollNo && rollNo !== user.rollNo) {
    const rollNoExists = await User.findOne({ rollNo });
    if (rollNoExists) {
      res.status(400);
      throw new Error('Roll number already exists');
    }
  }

  // Update user fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.primaryRole = primaryRole || user.primaryRole;
  user.secondaryRoles = secondaryRoles || user.secondaryRoles;
  user.department = department || user.department;
  
  // Update role-specific fields
  if (primaryRole === 'student') {
    user.semester = semester || user.semester;
    user.rollNo = rollNo || user.rollNo;
    user.isLeader = isLeader !== undefined ? isLeader : user.isLeader;
    user.staffId = undefined; // Clear staff ID if switching to student
  } else {
    user.staffId = staffId || user.staffId;
    user.rollNo = undefined; // Clear roll number if switching from student
    user.isLeader = false; // Clear leader status if switching from student
  }
  
  // Update mentor references
  if (tutorId !== undefined) user.tutorId = tutorId || null;
  if (acId !== undefined) user.acId = acId || null;
  if (hodId !== undefined) user.hodId = hodId || null;

  // Update password if provided
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    primaryRole: updatedUser.primaryRole,
    secondaryRoles: updatedUser.secondaryRoles,
    department: updatedUser.department,
    semester: updatedUser.semester,
    staffId: updatedUser.staffId,
    rollNo: updatedUser.rollNo,
    isLeader: updatedUser.isLeader,
    tutorId: updatedUser.tutorId,
    acId: updatedUser.acId,
    hodId: updatedUser.hodId
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if this user is a mentor for other users
  const menteeCount = await User.countDocuments({
    $or: [
      { tutorId: user._id },
      { acId: user._id },
      { hodId: user._id }
    ]
  });

  if (menteeCount > 0) {
    res.status(400);
    throw new Error('Cannot delete user: This user is assigned as a mentor to other users');
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'User deleted successfully' });
});

// Course Management
exports.getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate('teachers', 'name email');
  res.json(courses);
});

exports.createCourse = asyncHandler(async (req, res) => {
  const { courseId, courseName, department, semester, academicYear } = req.body;

  const courseExists = await Course.findOne({ courseId });
  if (courseExists) {
    res.status(400);
    throw new Error('Course ID already exists');
  }

  const course = await Course.create({
    courseId,
    courseName,
    department,
    semester,
    academicYear
  });

  res.status(201).json(course);
});

exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  Object.assign(course, req.body);
  const updatedCourse = await course.save();
  res.json(updatedCourse);
});

exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: 'Course removed successfully' });
});

// Make sure this function is properly exported
exports.batchUpdateSemester = asyncHandler(async (req, res) => {
  const { fromSemester, toSemester, department } = req.body;

  // Validate semester values
  const validSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  if (!validSemesters.includes(fromSemester) || !validSemesters.includes(toSemester)) {
    res.status(400);
    throw new Error('Invalid semester values');
  }

  // Build the query
  const query = { 
    primaryRole: 'student',
    semester: fromSemester
  };
  
  // Add department filter if provided
  if (department) {
    query.department = department;
  }

  try {
    // Perform the update
    const result = await User.updateMany(
      query,
      { $set: { semester: toSemester } }
    );

    // Return the result
    res.json({
      success: true,
      count: result.modifiedCount,
      fromSemester,
      toSemester,
      department: department || 'All'
    });
  } catch (error) {
    console.error('Error in batch update:', error);
    res.status(500).json({ 
      message: 'Database error during batch update',
      error: error.message 
    });
  }
});
