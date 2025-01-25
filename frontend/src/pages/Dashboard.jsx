import React, { useEffect, useState } from 'react';
import '../index.css';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

const Admin = () => {
    const [userData, setUserData] = useState({ firstName: '', lastName: '', role: '' });
    const [studentCount, setStudentCount] = useState(0);
    const [sectionData, setSectionData] = useState({});
    const [courseData, setCourseData] = useState({});

    useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // If there's no token, return and handle as needed
        if (!token) return;

        // Decode the token
        const decoded = JSON.parse(atob(token.split('.')[1]));

        // Update the userData state with decoded values
        setUserData({
            firstName: decoded.f_name || 'First name not available',
            lastName: decoded.l_name || 'Last name not available',
            role: decoded.role || 'Role not available'
        });

        // Fetch total students
        axios.get('http://localhost:5000/api/students/count')
            .then((res) => {
                console.log('Student Count:', res.data);
                setStudentCount(res.data.total);
            })
            .catch((err) => console.error(err));

        // Fetch section distribution
        axios.get('http://localhost:5000/api/students/distribution/section')
            .then((res) => {
                const labels = res.data.map(item => item.section);
                const counts = res.data.map(item => item.count);
                setSectionData({
                    labels,
                    datasets: [{
                        label: 'Students per Section',
                        data: counts,
                        backgroundColor: ['#FF2929', '#344CB7', '#FCC737', '#4BC0C0'],
                    }],
                });
            })
            .catch((err) => console.error(err));

        // Fetch course distribution
        axios.get('http://localhost:5000/api/students/distribution/course')
            .then((res) => {
                const labels = res.data.map(item => item.course);
                const counts = res.data.map(item => item.count);
                setCourseData({
                    labels,
                    datasets: [{
                        label: 'Students per Course',
                        data: counts,
                        backgroundColor: ['#FF2929', '#344CB7', '#FCC737', '#4BC0C0'],
                    }],
                });
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="admin-container" style={{ textAlign: 'center', fontFamily: "'Roboto', Arial, sans-serif", minHeight: '60vh', padding: '20px', marginTop: '20px' }}>
            <h1 className="user-info">Welcome, {userData.firstName} {userData.lastName} ({userData.role})</h1>

            <h1 style={{
                marginBottom: '50px',
                fontSize: '2.5rem',
                color: '#000000',
                borderBottom: '2px solid #B60000',
                display: 'inline-block',
                paddingBottom: '10px',
                fontWeight: 500,
            }}>
                Dashboard
            </h1>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '50px',
                flexWrap: 'wrap',
            }}>
                {/* Student Count Box */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '300px',
                    height: '350px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#ffffff',
                    padding: '20px',
                }}>
                    <h2 style={{ margin: '10px 0', color: '#000000', fontWeight: 500 }}>Total Students</h2>
                    <p style={{ fontSize: '3em', fontWeight: 'bold', color: '#FF2929', margin: 0 }}>{studentCount}</p>
                </div>

                {/* Section Distribution Graph */}
                <div style={{
                    width: '300px',
                    height: '350px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                    <h2 style={{ marginBottom: '10px', color: '#000000', fontWeight: 500 }}>Section Distribution</h2>
                    {sectionData.labels ? <Doughnut data={sectionData} /> : <p>Loading...</p>}
                </div>

                {/* Course Distribution Graph */}
                <div style={{
                    width: '300px',
                    height: '350px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                    <h2 style={{ marginBottom: '10px', color: '#000000', fontWeight: 500 }}>Course Distribution</h2>
                    {courseData.labels ? <Doughnut data={courseData} /> : <p>Loading...</p>}
                </div>
            </div>
        </div>
    );
};

export default Admin;
