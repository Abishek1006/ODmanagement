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
    const courses = await Course.find({ teachers: teacherId });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: 'Error fetching teacher courses' });
  }
};

// controllers/course.controller.js
exports.getStudentsWithOD = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const studentsWithOD = await User.find({
      courses: { $elemMatch: { courseId: course._id } },
    })
      .then(students => {
        const studentIds = students.map(student => student._id);
        return OD.find({
          studentId: { $in: studentIds },
          status: 'approved'
        })
          .then(odRequests => {
            const result = students.map(student => {
              const studentODRequests = odRequests.filter(odRequest => odRequest.studentId.toString() === student._id.toString());
              return { ...student.toObject(), odRequests: studentODRequests };
            });
            return result;
          });
      });

    res.json(studentsWithOD);
  } catch (error) {
    console.error('Error fetching students with OD:', error);
    res.status(500).json({ message: 'Error fetching students with OD' });
  }
};