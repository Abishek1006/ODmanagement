const Course = require('../models/course.model');

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