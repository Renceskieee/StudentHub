import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', 
        email: '', 
        password: ''
    });
    const navigate = useNavigate();
    
    // State for dialog
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async () => {
        try {
            // Make the registration request to your server
            await axios.post('http://localhost:5000/register', formData);
            setOpenSuccess(true); // Show success modal

            // Redirect to login after 1.5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 1500); // Show for 1.5 seconds

        } catch (error) {
            console.error('Registration Error:', error);

            // Show an error message based on the server response
            if (error.response && error.response.status === 400) {
                setErrorMessage('Email is already registered or invalid details.');
            } else {
                setErrorMessage('An error occurred during registration. Please try again.');
            }
            setOpenError(true); // Show error modal
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
                <Typography variant="h4" sx={{ marginTop: '50px', marginBottom: '0' }}>
                    Register
                </Typography>
                
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                />
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
                    onClick={handleRegister} 
                    variant="outlined" 
                    style={{ 
                        backgroundColor: '#B60000',  // Set background color
                        color: '#FFEA00',  
                        marginLeft: 'auto' 
                    }}
                    fullWidth
                >
                    Register
                </Button>

                {/* Login Link */}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ textDecoration: 'none', color: '#B60000' }}>
                        Login here
                    </Link>
                </Typography>
            </Box>

            {/* Success Modal */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    <p>Registration completed successfully! You will be redirected shortly.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{errorMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Register;
