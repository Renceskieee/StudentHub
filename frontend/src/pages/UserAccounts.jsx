import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const UserAccounts = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        f_name: '',
        l_name: '',
        email: '',
        role: '',
        mobile_number: '',
        birthday: '',
    });
    const [editUser, setEditUser] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const resetForm = () => {
        setFormData({
            username: '',
            f_name: '',
            l_name: '',
            email: '',
            role: '',
            mobile_number: '',
            birthday: '',
        });
        setEditUser(null);
    };

    const validateForm = () => {
        if (!formData.username.trim() || !formData.email.trim() || !formData.role.trim()) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const updateUser = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(`http://localhost:5000/users/${editUser.id}`, formData);
            showSnackbar('User updated successfully.', 'success');
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            showSnackbar('User deleted successfully.', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setFormData({
            username: user.username || '',
            f_name: user.f_name || '',
            l_name: user.l_name || '',
            email: user.email || '',
            role: user.role || '',
            mobile_number: user.mobile_number || '',
            birthday: user.birthday || '',
        });
    };    

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container>
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                User Profiles
            </Typography>

            <div style={{ marginBottom: '20px' }}>
                {editUser && (
                    <>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="First Name"
                            name="f_name"
                            value={formData.f_name}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="Last Name"
                            name="l_name"
                            value={formData.l_name}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                label="Role"
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Faculty">Faculty</MenuItem>
                                <MenuItem value="Teacher">Teacher</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Mobile Number"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="Birthday"
                            name="birthday"
                            type="date"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button onClick={updateUser} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update User
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                )}
            </div>

            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Username</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>First Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Last Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Email</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Role</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Mobile Number</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Birthday</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{user.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.username}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.f_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.l_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.email}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.role}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.mobile_number}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(user.birthday).toLocaleDateString('en-US')}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <IconButton onClick={() => handleEditClick(user)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => deleteUser(user.id)} color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserAccounts;
