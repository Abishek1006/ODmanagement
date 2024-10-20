// src/pages/TeacherDashboard.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/teacher.css';

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState('events');

  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <EventsContent />;
      case 'details':
        return <PersonalDetailsContent />;
      case 'od':
        return <ODSectionContent />;
      case 'grades':
        return <GradesContent />;
      default:
        return <EventsContent />;
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <nav className="sidebar">
          <ul>
            {['Events', 'Personal Details', 'OD Section', 'Grades'].map((item) => (
              <li key={item}>
                <button
                  className={`sidebar-button ${
                    activeSection === item.toLowerCase().replace(' ', '')
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => setActiveSection(item.toLowerCase().replace(' ', ''))}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main className="main-content">
          <h2 className="section-title">
            {activeSection.replace('od', 'OD').replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const EventsContent = () => (
  <div className="content-card">
    <h3>Upcoming Events</h3>
    <ul className="event-list">
      <li>
        <span className="event-date">May 15, 2024</span>
        <span>Faculty Development Program</span>
      </li>
      <li>
        <span className="event-date">June 1, 2024</span>
        <span>Annual Teachers' Conference</span>
      </li>
    </ul>
  </div>
);

const PersonalDetailsContent = () => (
  <div className="content-card">
    <h3>Personal Information</h3>
    <div className="info-grid">
      <div>
        <p className="info-label">Name</p>
        <p className="info-value">Dr. Jane Smith</p>
      </div>
      <div>
        <p className="info-label">Employee ID</p>
        <p className="info-value">T12345</p>
      </div>
      <div>
        <p className="info-label">Department</p>
        <p className="info-value">Computer Science</p>
      </div>
      <div>
        <p className="info-label">Join Date</p>
        <p className="info-value">September 1, 2020</p>
      </div>
    </div>
  </div>
);

const ODSectionContent = () => (
  <div className="content-card">
    <h3>On Duty Requests</h3>
    <table className="od-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Reason</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>May 20, 2024</td>
          <td>Conference Attendance</td>
          <td><span className="status approved">Approved</span></td>
        </tr>
        <tr>
          <td>June 5, 2024</td>
          <td>Workshop Participation</td>
          <td><span className="status pending">Pending</span></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const GradesContent = () => (
  <div className="content-card">
    <h3>Grade Management</h3>
    <p>Grade management functionality will be implemented here.</p>
  </div>
);

export default TeacherDashboard;