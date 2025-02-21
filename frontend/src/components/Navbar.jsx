import React, { useState } from 'react';
import sreclogo from "../assets/sreclogo.png";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // Updated imports for v2

function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <div className="sticky top-0 z-30">
      <div className={`navbar p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-orange-50 text-gray-900'}`}>
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo and College Name - Always visible */}
          <div className="flex items-center">
            <img src={sreclogo} alt="Snr_trust_logo" className="h-12 w-12 mr-4" />
            <h1 className="text-xl font-bold">SRI RAMAKRISHNA ENGINEERING COLLEGE</h1>
          </div>

          {/* Additional Info - Hidden on small screens, visible on medium and larger screens */}
          <div className="hidden md:block">
            <p>Educational Service: SNR Sons Charitable Trust, Autonomous Institution, Reaccredited by NAAC with 'A+' Grade</p>
            <p>Approved by AICTE and Permanently Affiliated to Anna University, Chennai [ISO 9001:2015 Certified and all eligible programmes Accredited by NBA]</p>
          </div>

          {/* Dark Mode Toggle Button - Always visible */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-orange-500 text-white' : 'bg-gray-900 text-white'}`}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {/* Add this div for spacing */}
      <div className="h-8"></div>
    </div>
  );
}

export default Navbar;