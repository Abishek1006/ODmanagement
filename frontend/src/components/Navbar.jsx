import React, { useState } from 'react';
import snrlogo from '../assets/snrlogo.png';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <div className="sticky top-0 z-50">
      <div className={`navbar p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-orange-50 text-gray-900'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src={snrlogo} alt="Snr_trust_logo" className="h-12 w-12 mr-4" />
            <h1 className="text-xl font-bold">SRI RAMAKRISHNA ENGINEERING COLLEGE</h1>
          </div>
          <div className="hidden md:block">
            <p>Educational Service: SNR Sons Charitable Trust, Autonomous Institution, Reaccredited by NAAC with 'A+' Grade</p>
            <p>Approved by AICTE and Permanently Affiliated to Anna University, Chennai [ISO 9001:2015 Certified and all eligible programmes Accredited by NBA]</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'
            }`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
      {/* Add this div for spacing */}
      <div className="h-8"></div>
    </div>
  );
}
export default Navbar;