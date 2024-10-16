// src/pages/StudentDashboard.jsx
import React from 'react';
import EventSection from '../components/EventSection';

const StudentDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-1/4 bg-gray-800 text-white h-screen p-4">
        <ul>
          <li className="mb-4"><a href="#events">Events</a></li>
          <li className="mb-4"><a href="#details">Personal Details</a></li>
          <li className="mb-4"><a href="#od">OD Section</a></li>
          <li className='mb-4'> <a href="#eventsection"> event section</a></li>
        </ul>
      </nav>

      {/* <main className="w-3/4 p-8">
        <section id="events">
          <EventSection />
        </section>
      
      </main> */}
    </div>
  );
};

export default StudentDashboard;
