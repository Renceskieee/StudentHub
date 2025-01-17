import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, MenuItem, Select, Snackbar, Alert } from '@mui/material';

function Upload() {
    const [file, setFile] = useState(null);
    const [selectedTable, setSelectedTable] = useState('');
    const [message, setMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Snackbar severity: 'success', 'error', 'info', 'warning'

    // List of tables for dropdown
    const tables = [
        'stud_profile',
    ];

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Please select a file before uploading.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (!selectedTable) {
            setMessage('Please select a table before uploading.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://localhost:5000/upload-xls/${selectedTable}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message || 'File uploaded successfully!');
            setSnackbarSeverity('success'); // Success message
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('File upload failed. Please try again.');
            setSnackbarSeverity('error'); // Error message
        }

        setSnackbarOpen(true); // Show snackbar after upload attempt
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Close the snackbar
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '70vh',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Upload XLS File
            </Typography>

            {/* Dropdown for selecting table */}
            <Select
                value={selectedTable}
                onChange={handleTableChange}
                displayEmpty
                style={{ marginBottom: '20px', width: '200px' }}
            >
                <MenuItem value="" disabled>
                    Select Table
                </MenuItem>
                {tables.map((table) => (
                    <MenuItem key={table} value={table}>
                        {table}
                    </MenuItem>
                ))}
            </Select>

            {/* File input */}
            <input
                type="file"
                onChange={handleFileChange}
                style={{ margin: '20px 0', display: 'block' }}
            />

            {/* Upload Button */}
            <Button
                variant="contained"
                color="error"
                size="medium"
                onClick={handleFileUpload}
                style={{ fontSize: '14px', padding: '8px 20px' }}
            >
                Upload
            </Button>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position: top center
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Upload;
