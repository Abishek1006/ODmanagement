import React from 'react'
import snrlogo from '../assets/snrlogo.png'
import sreclogo from '../assets/sreclogo.png'
import "./Navbar.css"
function Navbar() {
  return (
    <>
    <div className="navbar">
                <img src={snrlogo} alt="Snr_trust_logo" />
                <div className="navbar-content">
                    <h1>SRI RAMAKRISHNA ENGINEERING COLLEGE</h1>
                    <p>Educational Service: SNR Sons Charitable Trust, Autonomous Institution, Reaccredited by NAAC with ‘A+’ Grade</p>
                    <p>Approved by AICTE and Permanently Affiliated to Anna University, Chennai [ISO 9001:2015 Certified and all eligible programmes Accredited by NBA]</p>
                </div>
                <img src={sreclogo} alt="srec_logo" />
            </div>
    </>
  )
}

export default Navbar;