import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import snrlogo from "../assets/snrlogo.png";
import sreclogo from "../assets/sreclogo.png";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import ugcourse from "../assets/ugcourse.png";
import pgcourse from "../assets/pgcourse.png";
import "./Login.css";

function Slideshow() {
    const images = [image1, image2, image3, image4];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                prevSlide === images.length - 1 ? 0 : prevSlide + 1
            );
        }, 9000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="slideshow-container">
            <div
                className="slideshow-slide"
                style={{ transform: `translateX(${-currentSlide * 100}%)` }}
            >
                {images.map((img, index) => (
                    <img src={img} alt={`Slide ${index + 1}`} key={index} />
                ))}
            </div>
            <div className="slideshow-dot-container">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`slideshow-dot ${currentSlide === index ? "active" : ""}`}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

function Register() {
    const [isRegisterVisible, setRegisterVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const toggleRegister = () => {
        setRegisterVisible(!isRegisterVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

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

            <button className="register-toggle-btn" onClick={toggleRegister}>
                {isRegisterVisible ? "Close Register" : "Open Register"}
            </button>

            {isRegisterVisible && (
                <div className="register-overlay">
                    <div className="register-form">
                        <button className="register-close-btn" onClick={toggleRegister}>×</button>
                        <h2>Register</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Register</button>
                            <Link to="/login" className="forgot-password">Login</Link>
                        </form>
                    </div>
                </div>
            )}

            <Slideshow />
            
            <div className="course_section">
                <h1 className="heading">COURSES OFFERED</h1>
                <hr />
                <img src={ugcourse} alt="UG Courses" />
                <img src={pgcourse} alt="PG Courses" />
                <div className="info_section">
                    <div className="info_box">
                        <h1>NAAC</h1>
                        <h3>Accreditation</h3>
                    </div>
                    <div className="info_box">
                        <h1>300+</h1>
                        <h3>TOTAL FACULTY</h3>
                    </div>
                    <div className="info_box">
                        <h1>43</h1>
                        <h3>Campus Size (Acres)</h3>
                    </div>
                    <div className="info_box">
                        <h1>4000+</h1>
                        <h3>TOTAL STUDENTS</h3>
                    </div>
                </div>
            </div>

            <div className="aboutus">
                <img src={image1} alt="college image" />
                <div className="text-content">
                    <h3>About Us</h3>
                    <hr />
                    <p>Our college fosters an enriching learning environment by continuously improving its management systems, infrastructure, and faculty capabilities, ensuring students receive the best education possible.</p>
                </div>
            </div>

            <div className="vision_mission">
                <h3>VISION AND MISSION OF THE COLLEGE</h3>
                <h1>VISION</h1>
                <p>To develop into a leading world class Technological University consisting of Schools of Excellence in various disciplines with a co-existent Centre for Engineering Solutions Development for world-wide clientele.</p>
                <h1>Mission</h1>
                <p>To provide all necessary inputs to the students for them to grow into knowledge engineers and scientists attaining.</p>
                <ul>
                    <li>Excellence in domain knowledge- practice and theory.</li>
                    <li>Excellence in co-curricular and Extra curricular talents.</li>
                    <li>Excellence in character and personality.</li>
                </ul>
            </div>

            <div className="footer">
                <h3>Achieving excellence in Teaching & Learning process using state-of-the-art resources</h3>
                <p>Copyright 2021 SREC. All rights reserved.</p>
            </div>
        </>
    );
}

export default Register;
