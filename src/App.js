import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Grid, Paper } from '@mui/material';
import TopBar from './components/TopBar';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [contextText, setContextText] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [refreshPhotosKey, setRefreshPhotosKey] = useState(0);

  const toggleAdvanced = () => setAdvanced(prev => !prev);
  const handleLogin = (user) => setLoggedInUser(user);
  const handleLogout = () => {
    setLoggedInUser(null);
    setContextText('');      // Xóa context khi logout
  };
  const handlePhotoUploaded = () => setRefreshPhotosKey(prev => prev + 1);
 const updateContext = (user) => {
  if (user && typeof user === 'object') {
    // Nếu user là object, lấy first_name + last_name
    setContextText(`${user.first_name} ${user.last_name}`);
  } else if (typeof user === 'string') {
    // Nếu đã là string (trường hợp khác)
    setContextText(user);
  } else {
    setContextText('');
  }
};

  // Component bảo vệ route yêu cầu đăng nhập
  const RequireAuth = ({ children }) => {
    return loggedInUser ? children : <Navigate to="/login" replace />;
  };

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
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {/* Sidebar – chỉ hiển thị nếu đã đăng nhập */}
        {loggedInUser && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 1 }}>
              <UserList />
            </Paper>
          </Grid>
        )}
        {/* Nội dung chính – chiếm toàn bộ chiều rộng nếu chưa login */}
        <Grid item xs={12} md={loggedInUser ? 9 : 12}>
          <Paper sx={{ p: 2, minHeight: '80vh' }}>
            <Routes>
              <Route
                path="/login"
                element={
                  loggedInUser ? (
                    <Navigate to="/users" replace />
                  ) : (
                    <LoginRegister onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/users"
                element={
                  <RequireAuth>
                    <UserList />
                  </RequireAuth>
                }
              />
              <Route
                path="/users/:userId"
                element={
                  <RequireAuth>
                    <UserDetail onLoadUser={updateContext} />
                  </RequireAuth>
                }
              />
              <Route
                path="/photos/:userId/:photoIndex?"
                element={
                  <RequireAuth>
                    <UserPhotos
                      onLoadPhotos={updateContext}
                      advanced={advanced}
                      refreshKey={refreshPhotosKey}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/"
                element={
                  <Navigate to={loggedInUser ? '/users' : '/login'} replace />
                }
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
}

export default App;