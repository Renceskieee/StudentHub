import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, Drawer, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import Admin from './pages/Admin';
import Faculty from './pages/Faculty';
import Teacher from './pages/Teacher';
import About from './pages/About';
import SettingsForm from './SettingsForm';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import UserAccounts from './pages/UserAccounts';
import Upload from './pages/Upload';
import { LayoutDashboard, UserRoundPen, Upload as UploadIcon, Info, SquareUserRound, Settings } from 'lucide-react';

const drawerWidth = 240;

function App() {
  const [settings, setSettings] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Store the user's role
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [openLogoutModal, setOpenLogoutModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setIsAuthenticated(true);
      setRole(decoded.role);
    }

    // Retrieve the activeNavIndex from localStorage
    const savedIndex = localStorage.getItem('activeNavIndex');
    if (savedIndex !== null) {
      setActiveNavIndex(Number(savedIndex)); // Convert to number
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRole(null); // Clear role
    setActiveNavIndex(0); // Reset to "Dashboard" on logout
    localStorage.removeItem('activeNavIndex'); // Remove saved active index from localStorage
    setOpenLogoutModal(true); // Open modal after logout
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false); // Close the modal
    window.location.href = '/login'; // Redirect to login after modal is closed
  };

  const handleNavClick = (index) => {
    setActiveNavIndex(index);
    localStorage.setItem('activeNavIndex', index); // Save to localStorage
  };

const roleBasedRoutes = {
  admin: [
    { path: '/dashboard', element: <Admin />, label: 'Dashboard', icon: <LayoutDashboard /> },
    { path: '/studentprofile', element: <StudentProfile />, label: 'Student Profiles', icon: <UserRoundPen /> },
    { path: '/upload', element: <Upload />, label: 'Upload', icon: <UploadIcon /> },
    { path: '/useraccount', element: <UserAccounts />, label: 'User Accounts', icon: <SquareUserRound /> },
    { path: '/about', element: <About />, label: 'About', icon: <Info /> },
    { 
      path: '/settings', 
      element: <SettingsForm onUpdate={() => {
          const fetchUpdatedSettings = async () => {
              try {
                  const response = await axios.get('http://localhost:5000/api/settings');
                  setSettings(response.data);
              } catch (error) {
                  console.error('Error fetching updated settings:', error);
              }
          };
          fetchUpdatedSettings();
      }} />, 
      label: 'Settings', 
      icon: <Settings /> 
    },
  ],
  faculty: [
    { path: '/dashboard', element: <Faculty />, label: 'Dashboard', icon: <LayoutDashboard /> },
    { path: '/studentprofile', element: <StudentProfile />, label: 'Student Profiles', icon: <UserRoundPen /> },
    { path: '/upload', element: <Upload />, label: 'Upload', icon: <UploadIcon /> },
    { path: '/about', element: <About />, label: 'About', icon: <Info /> },
  ],
  teacher: [
    { path: '/dashboard', element: <Teacher />, label: 'Dashboard', icon: <LayoutDashboard /> },
    { path: '/studentprofile', element: <StudentProfile />, label: 'Student Profiles', icon: <UserRoundPen /> },
    { path: '/about', element: <About />, label: 'About', icon: <Info /> },
  ],
};

  const generateRoutes = () => {
    if (!role) return null;
    return roleBasedRoutes[role].map((route) => (
      <Route key={route.path} path={route.path} element={isAuthenticated ? route.element : <Navigate to="/login" />} />
    ));
  };

  const generateSidebarLinks = () => {
    if (!role) return null;
    return roleBasedRoutes[role].map((route, index) => (
      <ListItem
        key={route.path}
        button
        component={Link}
        to={route.path}
        selected={activeNavIndex === index}
        onClick={() => handleNavClick(index)} // Use updated handler
        style={{
          backgroundColor: activeNavIndex === index ? settings.active_nav_index_color || '#1976d2' : 'transparent',
          padding: '10px 20px', // Add padding for space
        }}
      >
        {route.icon}
        <ListItemText 
          primary={route.label} 
          sx={{ marginLeft: 2 }} // This adds space between icon and text
        />
      </ListItem>
    ));
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: settings.header_color || 'primary' }}>
          <Toolbar>
            {settings.logo_url && (
              <img
                src={`http://localhost:5000${settings.logo_url}`}
                alt="Logo"
                style={{ height: '40px', marginRight: '10px' }}
              />
            )}

            <Typography variant="h6" noWrap sx={{ color: settings.company_name_color || 'inherit' }}>
              {settings.company_name || 'My Company Name'}
            </Typography>
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="contained"
                style={{ backgroundColor: 'yellow', color: '#B60000', marginLeft: 'auto' }}
              >
                Log out
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        {isAuthenticated && (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            <List>{generateSidebarLinks()}</List>
          </Drawer>
        )}

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}>
          <Toolbar />
          <Routes>
            {generateRoutes()}
            <Route
              path="/login"
              element={
                <Login
                  onLoginSuccess={(userRole) => {
                    setIsAuthenticated(true);
                    setRole(userRole);
                    const defaultRoute = {
                      admin: '/admin',
                      faculty: '/faculty',
                      teacher: '/teacher',
                    }[userRole];
                    window.location.href = defaultRoute || '/dashboard'; // Redirect to default route
                  }}
                />
              }
            />
            <Route path="/register" element={<Register />} />
            {/* Default redirect to /login */}
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Admin /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Faculty /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Teacher /> : <Navigate to="/dashboard" />} />
            <Route path="/studentprofile" element={isAuthenticated ? <StudentProfile /> : <Navigate to="/studentprofile" />} />
            <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/upload" />} />
            <Route path="/useraccount" element={isAuthenticated ? <UserAccounts /> : <Navigate to="/useraccount" />} />
            <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/about" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/settings" />} />
          </Routes>
        </Box>
        
        {/* Footer */}
        <Box
          component="footer"
          sx={{
            width: '100%',
            position: 'relative',
            bottom: 0,
            left: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: settings.footer_color || '#ffffff',
            color: 'black',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ color: settings.footer_text_color || 'inherit' }}
          >
            {settings.footer_text || 'Default Footer Text'}
          </Typography>
        </Box>
      </Box>

      {/* Logout Modal */}
      <Dialog open={openLogoutModal} onClose={handleCloseLogoutModal}>
        <DialogTitle>Logged Out</DialogTitle>
        <DialogContent>
          <Typography>You have successfully logged out.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutModal} color="error" variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </Router>
  );
}

export default App;
