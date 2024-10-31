import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './pages/StudentDashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/student-dashboard/*" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;