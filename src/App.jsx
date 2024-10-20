import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import EventSection from './components/EventSection';
import PersonalDetails from './components/PersonalDetails';
import ODSection from './components/ODSection';
import CreateEvent from './components/CreateEvent';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />}>
          <Route index element={<EventSection />} />
          <Route path="events" element={<EventSection />} />
          <Route path="personal-details" element={<PersonalDetails />} />
          <Route path="od-section" element={<ODSection />} />
          <Route path="create-event" element={<CreateEvent />} />
        </Route>
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
