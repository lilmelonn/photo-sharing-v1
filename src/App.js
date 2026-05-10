import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Grid, Paper } from '@mui/material';
import TopBar from './components/TopBar';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserPhotos from './components/UserPhotos';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [contextText, setContextText] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [refreshPhotosKey, setRefreshPhotosKey] = useState(0); // thêm state refresh

  const toggleAdvanced = () => setAdvanced(prev => !prev);

  const handleLogin = (user) => setLoggedInUser(user);
  const handleLogout = () => setLoggedInUser(null);

  const handlePhotoUploaded = () => {
    // Tăng key để UserPhotos reload
    setRefreshPhotosKey(prev => prev + 1);
  };

  // Wrappers
  const UserDetailWrapper = () => (
    <UserDetail onLoadUser={(user) => setContextText(`${user.first_name} ${user.last_name}`)} />
  );

  const UserPhotosWrapper = () => (
    <UserPhotos
      onLoadPhotos={(user) => setContextText(`Photos of ${user.first_name} ${user.last_name}`)}
      advanced={advanced}
      refreshKey={refreshPhotosKey} // truyền key xuống
    />
  );

  return (
    <BrowserRouter>
      <TopBar
        user={loggedInUser}
        contextText={contextText}
        advancedEnabled={advanced}
        onAdvancedToggle={toggleAdvanced}
        onLogout={handleLogout}
        onPhotoUploaded={handlePhotoUploaded}
      />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 1 }}>
            <UserList />
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            <Routes>
              <Route path="/users/:userId" element={<UserDetailWrapper />} />
              <Route path="/photos/:userId/:photoIndex?" element={<UserPhotosWrapper />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/" element={<Navigate to="/users" replace />} />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}

export default App;