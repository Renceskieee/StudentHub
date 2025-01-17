import React from 'react';
import '../index.css'; // Assuming you are using index.css for global styles
import EARISTLogo from '../assets/EARIST_Logo.png'; // Adjust the path if necessary

function About() {
  return (
    <div className="contact-container">
      <div className="header">
        <img src={EARISTLogo} alt="EARIST Logo" className="logo" />
        <h1 className="title">Eulogio "Amang" Rodriguez Institute of Science and Technology</h1>
      </div>
      <p className="address">Nagtahan, Sampaloc, Manila</p>
      <div className="about">
        <p>
          We are Group 4 of the Application Development and Emerging Technologies course. Our program is Bachelor of Science in Information Technology, and we are currently third-year students from Section C.
        </p>
        <p>
          As part of our course requirements, we developed a Student Information Management System to enhance the management of student data. This system aims to simplify and improve the processes of storing, accessing, and updating student information.
        </p>
        <h3>Leader:</h3>
        <p>Angela Tanya G. Navarrosa</p>
        <h3>Members:</h3>
        <ul>
          <li>Laurence Paul G. Quiniano</li>
          <li>Lance Kyle Dhem B. Cuizon</li>
          <li>Ericka Anne T. Yang</li>
        </ul>
        <h3>Adviser:</h3>
        <p>Jefferson A. Costales</p>
      </div>
    </div>
  );
}

export default About;
