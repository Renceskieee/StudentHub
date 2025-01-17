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
    Snackbar,
    Alert,
    IconButton,
    MenuItem,
    Grid,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const StudentProfile = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        student_number: '',
        email: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        course: '',
        section: '',
        birthday: '',
        civil_status: '',
        citizenship: '',
        religion: '',
        home_address: '',
        zip_code: '',
        mobile_number: '',
    });
    const [editStudent, setEditStudent] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            student_number: '',
            email: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            course: '',
            section: '',
            birthday: '',
            civil_status: '',
            citizenship: '',
            religion: '',
            home_address: '',
            zip_code: '',
            mobile_number: '',
        });
        setEditStudent(null);
    };

    const addStudent = async () => {
        try {
            await axios.post('http://localhost:5000/students', formData);
            fetchStudents();
            resetForm();
            setSnackbar({ open: true, message: 'Student added successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error adding student:', error);
            setSnackbar({ open: true, message: 'Failed to add student.', severity: 'error' });
        }
    };

    const updateStudent = async () => {
        try {
            await axios.put(`http://localhost:5000/students/${editStudent.id}`, formData);
            fetchStudents();
            resetForm();
            setSnackbar({ open: true, message: 'Student updated successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error updating student:', error);
            setSnackbar({ open: true, message: 'Failed to update student.', severity: 'error' });
        }
    };

    const deleteStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/students/${id}`);
            fetchStudents();
            setSnackbar({ open: true, message: 'Student deleted successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error deleting student:', error);
            setSnackbar({ open: true, message: 'Failed to delete student.', severity: 'error' });
        }
    };

    const handleEditClick = (student) => {
        setEditStudent(student);
        setFormData({ ...student });
    };

    const handleSubmit = () => {
        if (editStudent) {
            updateStudent();
        } else {
            addStudent();
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container sx={{ paddingTop: '20px', paddingBottom: '40px' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                Student Profiles
            </Typography>
            
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                {[ 
                    { label: 'Student Number', name: 'student_number' },
                    { label: 'Email', name: 'email' },
                ].map((field, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <TextField
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                ))}

                {[ 
                    { label: 'First Name', name: 'first_name' },
                    { label: 'Middle Name', name: 'middle_name' },
                    { label: 'Last Name', name: 'last_name' },
                ].map((field, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                        <TextField
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                ))}

                {[ 
                    { label: 'Course', name: 'course' },
                    { label: 'Section', name: 'section' },
                ].map((field, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <TextField
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Birthday"
                        name="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {[ 
                    { label: 'Civil Status', name: 'civil_status', options: ['Single', 'Married', 'Widowed'] },
                    { label: 'Citizenship', name: 'citizenship' },
                    { label: 'Religion', name: 'religion' },
                ].map((field, idx) =>
                    field.options ? (
                        <Grid item xs={12} sm={4} key={idx}>
                            <TextField
                                label={field.label}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                select
                                fullWidth
                            >
                                {field.options.map((option, idx) => (
                                    <MenuItem key={idx} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    ) : (
                        <Grid item xs={12} sm={4} key={idx}>
                            <TextField
                                label={field.label}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Grid>
                    )
                )}

                {[ 
                    { label: 'Home Address', name: 'home_address' },
                    { label: 'Zip Code', name: 'zip_code' },
                    { label: 'Mobile Number', name: 'mobile_number' },
                ].map((field, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                        <TextField
                            label={field.label}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                <Grid item xs={12}>
                    <Button onClick={handleSubmit} variant="contained" color="error" fullWidth>
                        {editStudent ? 'Update Student' : 'Add Student'}
                    </Button>
                </Grid>
                {editStudent && (
                    <Grid item xs={12}>
                        <Button onClick={resetForm} variant="outlined" fullWidth sx={{ marginTop: '10px' }}>
                            Cancel
                        </Button>
                    </Grid>
                )}
            </Grid>

            <Table sx={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Student Number</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Email</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>First Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Middle Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Last Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Course</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Section</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{student.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.student_number}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.email}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.first_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.middle_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.last_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.course}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{student.section}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <IconButton onClick={() => handleEditClick(student)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => deleteStudent(student.id)} color="error">
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

export default StudentProfile;
