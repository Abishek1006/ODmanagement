import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard/*" element={<StudentDashboard />} />
        
        {/* Teacher Dashboard Routes */}
        <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;