// controllers/course.controller.js
const Course = require('../models/course.model');
const User = require('../models/user.model'); // Add this line
const OD = require('../models/od.model'); // Add this line if you are using OD model

exports.createCourse = async (req, res) => {
  try {
    const { courseId, courseName, department, teachers } = req.body;

    const course = new Course({
      courseId,
      courseName,
      department,
      teachers
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// controllers/course.controller.js
exports.getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user._id;
    console.log('Teacher ID:', teacherId);
    
    const courses = await Course.find({ teachers: teacherId })
                              .select('courseId courseName department');
    
    console.log('Found courses:', courses);
    res.json(courses);
  } catch (error) {
    console.error('Error in getTeacherCourses:', error);
    res.status(500).json({ 
      message: 'Error fetching teacher courses',
      error: error.message 
    });
  }
};


// controllers/course.controller.js
exports.getStudentsWithOD = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // First get the course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find all students enrolled in this course
    const students = await User.find({
      'courses.courseId': courseId,
      primaryRole: 'student'
    });

    // Get OD details for each student
    const studentsWithODDetails = await Promise.all(students.map(async (student) => {
      const odRequests = await OD.find({
        studentId: student._id,
        dateFrom: { $lte: new Date() },
        dateTo: { $gte: new Date() }
      });

      return {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        department: student.department,
        odRequests: odRequests
      };
    }));

    res.json({
      courseName: course.courseName,
      courseId: course.courseId,
      students: studentsWithODDetails
    });

  } catch (error) {
    console.error('Error fetching students with OD:', error);
    res.status(500).json({ message: 'Error fetching students data' });
  }
};
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

const fetchCourses = async () => {
  try {
    const response = await api.get('/teacher-courses');  // Corrected route
    console.log('Courses Response:', response.data);  // Add logging
    setCourses(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Full Error:', error);  // Detailed error logging
    setError(error.response?.data?.message || 'Failed to load courses');
    setLoading(false);
  }
};
