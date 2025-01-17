import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, role }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirect to login if no token
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token

            // Check if the role in the token matches the expected role(s)
            if (Array.isArray(role) ? !role.includes(decoded.role) : decoded.role !== role) {
                navigate('/login'); // Redirect if roles do not match
                return;
            }

            // If all checks pass, allow access
            setIsAuthorized(true);
        } catch (error) {
            console.error('Invalid token:', error);
            navigate('/login'); // Redirect to login if token decoding fails
        }
    }, [navigate, token, role]);

    if (!token || !isAuthorized) {
        return null; // Optionally, show a loading spinner here
    }

    return <Component />;
};

export default ProtectedRoute;
