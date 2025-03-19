import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import api from './services/api';

const ProtectedAdminRoute = () => {
  const userRoles = api.getUserRoles();
  if (!userRoles || !api.getUserDetails()?.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <AdminDashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard/*" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard/*" element={<ProtectedAdminRoute />} />
      </Routes>
    </Router>
  );
}

export default App;