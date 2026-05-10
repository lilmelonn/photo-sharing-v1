import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import PhotoUploadModal from '../PhotoUploadModal';

function TopBar({ user, contextText, advancedEnabled, onAdvancedToggle, onLogout, onPhotoUploaded }) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadClose = () => setUploadModalOpen(false);
  const handleUploadSuccess = () => {
    if (onPhotoUploaded) onPhotoUploaded();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Your Name
          </Typography>
          {user && (
            <Button color="inherit" onClick={() => setUploadModalOpen(true)}>
              Add Photo
            </Button>
          )}
          <FormControlLabel
            control={<Checkbox checked={advancedEnabled} onChange={onAdvancedToggle} color="default" />}
            label="Enable Advanced Features"
            sx={{ color: 'white', mx: 2 }}
          />
          {user ? (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Hi {user.first_name}
              </Typography>
              <Button color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1">Please Login</Typography>
          )}
          <Typography variant="subtitle1" sx={{ ml: 2 }}>{contextText}</Typography>
        </Toolbar>
      </AppBar>
      <PhotoUploadModal
        open={uploadModalOpen}
        onClose={handleUploadClose}
        onUploaded={handleUploadSuccess}
      />
    </>
  );
}

export default TopBar;