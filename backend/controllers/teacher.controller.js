exports.getTeacherDashboard = async (req, res) => {
    try {
      const teacherId = req.user._id;
      const courses = await Course.find({ teachers: teacherId });
      const studentsWithOD = await Promise.all(courses.map(course => {
        return getStudentsWithOD(course._id);
      }));
  
      res.render('teacher-dashboard', { courses, studentsWithOD });
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      res.status(500).json({ message: 'Error fetching teacher dashboard' });
    }
  };