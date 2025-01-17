import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Container, Typography, Grid } from '@mui/material';

function Dashboard() {

    return (
        <Container>
            <Typography variant="h4" component="h1" sx={{ margin: '20px 0', textAlign: 'center' }}>
                Dashboard
            </Typography>
        </Container>
    );
}

export default Dashboard;
