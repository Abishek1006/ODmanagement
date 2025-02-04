import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
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
    <Router basename={process.env.NODE_ENV === 'production' ? '/e-od-system' : '/'}>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard/*" element={<StudentDashboard />} />
        
        {/* Teacher Dashboard Routes */}
        <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard/*" element={<ProtectedAdminRoute />} />
      </Routes>
    </Router>
  );
}

export default App;