import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Input, InputLabel } from '@mui/material';

function SettingsForm({ onUpdate }) {
    const [companyName, setCompanyName] = useState('');
    const [companyNameColor, setCompanyNameColor] = useState('#000000'); // New state for CompanyName color
    const [logo, setLogo] = useState(null);
    const [headerColor, setHeaderColor] = useState('#ffffff');
    const [footerText, setFooterText] = useState('');
    const [footerTextColor, setFooterTextColor] = useState('#000000'); // New state for FooterText color
    const [footerColor, setFooterColor] = useState('#ffffff');
    const [activeNavIndexColor, setActiveNavIndexColor] = useState('#000000');

    useEffect(() => {
        // Fetch current settings to populate the form fields
        axios.get('http://localhost:5000/api/settings')
            .then(response => {
                const {
                    company_name,
                    company_name_color,
                    header_color,
                    footer_text,
                    footer_text_color,
                    footer_color,
                    active_nav_index_color,
                } = response.data;

                setCompanyName(company_name || '');
                setCompanyNameColor(company_name_color || '#000000'); // Initialize CompanyName color
                setHeaderColor(header_color || '#ffffff');
                setFooterText(footer_text || '');
                setFooterTextColor(footer_text_color || '#000000'); // Initialize FooterText color
                setFooterColor(footer_color || '#ffffff');
                setActiveNavIndexColor(active_nav_index_color || '#000000');
            })
            .catch(error => console.error('Error fetching settings:', error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('company_name', companyName || '');
        formData.append('company_name_color', companyNameColor || '#000000'); // Append CompanyName color
        formData.append('logo', logo);
        formData.append('header_color', headerColor || '#ffffff');
        formData.append('footer_text', footerText || '');
        formData.append('footer_text_color', footerTextColor || '#000000'); // Append FooterText color
        formData.append('footer_color', footerColor || '#ffffff');
        formData.append('active_nav_index_color', activeNavIndexColor || '#000000');

        try {
            await axios.post('http://localhost:5000/api/settings', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onUpdate();  // Trigger re-fetch of updated data
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <InputLabel htmlFor="companyName">Company Name</InputLabel>
                <TextField
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ color: companyNameColor }}  // Apply company name color here
                />
            </div>

            {/* Color picker for Company Name */}
            <div>
                <InputLabel htmlFor="companyNameColor">Company Name Color</InputLabel>
                <Input
                    id="companyNameColor"
                    type="color"
                    value={companyNameColor}
                    onChange={(e) => setCompanyNameColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>

            <div>
                <InputLabel htmlFor="logo">Logo</InputLabel>
                <Input
                    id="logo"
                    type="file"
                    onChange={(e) => setLogo(e.target.files[0])}
                    fullWidth
                    margin="normal"
                />
            </div>

            <div>
                <InputLabel htmlFor="headerColor">Header Color</InputLabel>
                <Input
                    id="headerColor"
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>

            <div>
                <InputLabel htmlFor="footerText">Footer Text</InputLabel>
                <TextField
                    id="footerText"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    fullWidth
                    margin="normal"
                    style={{ color: footerTextColor }}  // Apply footer text color here
                />
            </div>

            {/* Color picker for Footer Text */}
            <div>
                <InputLabel htmlFor="footerTextColor">Footer Text Color</InputLabel>
                <Input
                    id="footerTextColor"
                    type="color"
                    value={footerTextColor}
                    onChange={(e) => setFooterTextColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>

            <div>
                <InputLabel htmlFor="footerColor">Footer Color</InputLabel>
                <Input
                    id="footerColor"
                    type="color"
                    value={footerColor}
                    onChange={(e) => setFooterColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>

            <div>
                <InputLabel htmlFor="activeNavIndexColor">Active Navigation Index Color</InputLabel>
                <Input
                    id="activeNavIndexColor"
                    type="color"
                    value={activeNavIndexColor}
                    onChange={(e) => setActiveNavIndexColor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </div>

            <Button type="submit" variant="contained" color="error">
                Save Settings
            </Button>
        </form>
    );
}

export default SettingsForm;
