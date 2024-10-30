import { Routes, Route } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-dashboard/*" element={<StudentDashboard />} />
      <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />
    </Routes>
  );
}

export default App;
