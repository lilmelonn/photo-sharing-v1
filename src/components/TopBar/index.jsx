import React, { useState } from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import PhotoUploadModal from '../PhotoUploadModal';

// Không cần BACKEND_URL vì axios đã được config baseURL toàn cục
// Đảm bảo trong src/index.js có:
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.withCredentials = true;

function TopBar({ 
  user, 
  contextText, 
  advancedEnabled, 
  onAdvancedToggle, 
  onLogout, 
  onPhotoUploaded 
}) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadClose = () => setUploadModalOpen(false);
  const handleUploadSuccess = () => {
    if (onPhotoUploaded) onPhotoUploaded();
  };

   const handleLogoutClick = async () => {
    try {
      // Gửi yêu cầu đến endpoint /admin/logout
      await axios.post('/admin/logout');
      if (onLogout) onLogout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Left side: your name */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Your Name
          </Typography>

          {/* Add Photo button – only when logged in */}
          {user && (
            <Button color="inherit" onClick={() => setUploadModalOpen(true)}>
              Add Photo
            </Button>
          )}

          {/* Advanced Features checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={advancedEnabled}
                onChange={onAdvancedToggle}
                color="default"
              />
            }
            label="Enable Advanced Features"
            sx={{ color: 'white', mx: 2 }}
          />

          {/* Right side: user greeting / login prompt */}
          {user ? (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Hi {user.first_name}
              </Typography>
              <Button color="inherit" onClick={handleLogoutClick}>
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1">Please Login</Typography>
          )}

          {/* Context text (e.g. "Photos of John" or user name) */}
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            {contextText}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Modal for uploading photos */}
      <PhotoUploadModal
        open={uploadModalOpen}
        onClose={handleUploadClose}
        onUploaded={handleUploadSuccess}
      />
    </>
  );
}

export default TopBar;