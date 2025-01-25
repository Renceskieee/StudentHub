import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';

const Login = ({ onLoginSuccess }) => { 
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        console.log("Login request payload:", formData);
    
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            console.log("Login response:", response.data);
    
            localStorage.setItem('token', response.data.token);
            onLoginSuccess();
    
            // Decode token
            let decoded;
            try {
                decoded = JSON.parse(atob(response.data.token.split('.')[1]));
                console.log("Decoded token:", decoded);
            } catch (err) {
                console.error("Token decoding error:", err);
                setErrorMessage('Failed to process user role. Please contact support.');
                setOpenError(true);
                return;
            }
    
            setOpenSuccess(true); // Open the success modal
    
            // Delay navigation to allow the modal to display
            setTimeout(() => {
                if (decoded.role === 'admin') {
                    navigate('/admin');
                } else if (decoded.role === 'faculty') {
                    navigate('/faculty');
                } else if (decoded.role === 'teacher') {
                    navigate('/teacher');
                } else {
                    setErrorMessage('Role not recognized.');
                    setOpenError(true);
                }
            }, 2000);
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
    
            setErrorMessage(
                error.response?.data?.error || 'An error occurred during login. Please try again.'
            );
            setOpenError(true);
        }
    };            
    
    const handleCloseSuccess = () => {
        setOpenSuccess(false);
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    return (
        <Container>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '70vh', 
                    gap: 2, 
                    maxWidth: '400px', 
                    margin: 'auto', 
                    transform: 'translateX(-100px)',
                }}
            >
                <Typography variant="h4" sx={{ margin: '0' }}>
                    Login
                </Typography>
                <TextField 
                    label="Email" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
                <Button 
                    onClick={handleLogin} 
                    variant="outlined" 
                    style={{ 
                        backgroundColor: '#B60000',
                        color: '#FFEA00',  
                        marginLeft: 'auto' 
                    }}
                    fullWidth
                >
                    Login
                </Button>
                
                {/* Register Link */}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none', color: '#B60000' }}>
                        Register here
                    </Link>
                </Typography>
            </Box>

            {/* Success Modal */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle>Login Successful</DialogTitle>
                <DialogContent>
                    <p>Welcome back! You will be redirected shortly.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess} color="error" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{errorMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} color="error" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login;
