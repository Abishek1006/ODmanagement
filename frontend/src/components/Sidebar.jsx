import React from 'react';
import { Link } from 'react-router-dom';
 import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul>
       <br />
       <br />
       <br />
       <br />
       <br />
       <br />
       <br />
       <br />
       <br />
       <br />
          <li>
            <Link to="/create" className="sidebar-link">
              Create Event
            </Link>
          </li>
         
          <li>
            <Link to="/" className="sidebar-link">
              View all events
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;