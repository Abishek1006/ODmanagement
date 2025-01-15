import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/Login.css"; // Assuming we'll use the same CSS file as Login

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    primaryRole: 'student',
    secondaryRole: '',
    department: '',
    rollNo: '',
    staffId: '',
  });
  const [error, setError] = useState('');
  const [isRegisterVisible, setRegisterVisible] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.primaryRole);
      if (response.data.primaryRole === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  const toggleRegister = () => {
    setRegisterVisible(!isRegisterVisible);
  };

  return (
    <>
      <button className="login-toggle-btn" onClick={toggleRegister}>
        {isRegisterVisible ? "Close Register" : "Open Register"}
      </button>
      {isRegisterVisible && (
        <div className="login-overlay">
          <div className="login-form">
            <button className="login-close-btn" onClick={toggleRegister}>×</button>
            <h2>Create your account</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
              
              <label htmlFor="email-address">Email address:</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              
              <label htmlFor="primaryRole">Primary Role:</label>
              <select
                id="primaryRole"
                name="primaryRole"
                required
                value={formData.primaryRole}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="tutor">Tutor</option>
                <option value="ac">Academic Coordinator</option>
                <option value="hod">Head of Department</option>
              </select>
              
              {formData.primaryRole !== 'student' && (
                <>
                  <label htmlFor="secondaryRole">Secondary Role:</label>
                  <select
                    id="secondaryRole"
                    name="secondaryRole"
                    value={formData.secondaryRole}
                    onChange={handleChange}
                  >
                    <option value="">No Secondary Role</option>
                    <option value="teacher">Teacher</option>
                    <option value="tutor">Tutor</option>
                    <option value="ac">Academic Coordinator</option>
                    <option value="hod">Head of Department</option>
                  </select>
                </>
              )}
              
              <label htmlFor="department">Department:</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                value={formData.department}
                onChange={handleChange}
              />
              
              {formData.primaryRole === 'student' ? (
                <>
                  <label htmlFor="rollNo">Roll Number:</label>
                  <input
                    id="rollNo"
                    name="rollNo"
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="staffId">Staff ID:</label>
                  <input
                    id="staffId"
                    name="staffId"
                    type="text"
                    required
                    value={formData.staffId}
                    onChange={handleChange}
                  />
                </>
              )}
              
              {error && <p className="error-message">{error}</p>}
              
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;