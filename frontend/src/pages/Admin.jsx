import React, { useEffect, useState } from 'react';
import '../index.css';
import Dashboard from './Dashboard';

const Admin = () => {
    const [userData, setUserData] = useState({ firstName: '', lastName: '', role: '' });

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
    }, []);

    return (
        <div>
            {/* Call the Dashboard component */}
            <Dashboard />
        </div>
    );
};

export default Admin;
