// controllers/course.controller.js
const Course = require('../models/course.model');
const User = require('../models/user.model');
const CourseEnrollment = require('../models/courseEnrollment.model');
const OD = require('../models/od.model');
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
    const courses = await Course.find({ 
      teachers: teacherId 
    }).select('_id courseId courseName department');

    res.json(courses);
  } catch (error) {
    console.error('Error in getTeacherCourses:', error);
    res.status(500).json({
      message: 'Error fetching teacher courses',
      error: error.message
    });
  }
};
exports.getStudentsWithOD = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course || !course.teachers.includes(teacherId)) {
      return res.status(403).json({ message: 'Not authorized to view this course' });
    }

    const enrollments = await CourseEnrollment.find({
      courseId,
      teacherId
    }).populate('studentId', 'name rollNo department');

    // Get today's date and yesterday's date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const studentsWithODDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const todayODs = await OD.find({
          studentId: enrollment.studentId._id,
          status: 'approved',
          dateFrom: { $lte: today },
          dateTo: { $gte: today }
        }).select('eventName dateFrom dateTo startTime endTime reason');

        const yesterdayODs = await OD.find({
          studentId: enrollment.studentId._id,
          status: 'approved',
          dateFrom: { $lte: yesterday },
          dateTo: { $gte: yesterday }
        }).select('eventName dateFrom dateTo startTime endTime reason');

        return {
          _id: enrollment.studentId._id,
          name: enrollment.studentId.name,
          rollNo: enrollment.studentId.rollNo,
          department: enrollment.studentId.department,
          todayODs,
          yesterdayODs
        };
      })
    );

    res.json({
      courseName: course.courseName,
      courseId: course.courseId,
      totalStudents: enrollments.length,
      studentsWithOD: studentsWithODDetails
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching students data' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ courseId: req.params.courseId })
      .populate({
        path: 'teachers',
        select: 'name staffId email'
      });
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

exports.addTeachingCourse = async (req, res) => {
  try {
    const { courseId } = req.body; // This will now be "CS102"
    const course = await Course.findOne({ courseId: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await Course.findByIdAndUpdate(course._id, {
      $addToSet: { teachers: req.user._id }
    });
    
    res.status(200).json({ message: 'Course added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};
