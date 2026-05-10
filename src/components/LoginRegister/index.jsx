import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Paper, Grid } from '@mui/material';

// Địa chỉ backend cố định
const BACKEND_URL = 'http://localhost:3000';

function LoginRegister({ onLogin }) {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registration state
  const [regData, setRegData] = useState({
    login_name: '', password: '', confirmPassword: '',
    first_name: '', last_name: '', location: '', description: '', occupation: ''
  });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      // Không cần URL tuyệt đối, axios sẽ tự động nối với baseURL
      const res = await axios.post('/admin/login', { login_name: loginName, password });
      onLogin(res.data);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      setRegError('Passwords do not match');
      return;
    }
    try {
      const { confirmPassword, ...userData } = regData;
      const res = await axios.post(`${BACKEND_URL}/user`, userData);
      setRegSuccess(`Registration successful! Please login as ${res.data.login_name}`);
      setRegError('');
      setRegData({
        login_name: '', password: '', confirmPassword: '',
        first_name: '', last_name: '', location: '', description: '', occupation: ''
      });
    } catch (err) {
      setRegError(err.response?.data?.error || 'Registration failed');
      setRegSuccess('');
    }
  };

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth margin="normal" label="Login name"
              value={loginName} onChange={e => setLoginName(e.target.value)} required
            />
            <TextField
              fullWidth margin="normal" label="Password" type="password"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
            {loginError && <Typography color="error">{loginError}</Typography>}
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Register</Typography>
          <form onSubmit={handleRegister}>
            <TextField fullWidth margin="normal" label="Login name*" value={regData.login_name}
              onChange={e => setRegData({...regData, login_name: e.target.value})} required />
            <TextField fullWidth margin="normal" label="Password*" type="password" value={regData.password}
              onChange={e => setRegData({...regData, password: e.target.value})} required />
            <TextField fullWidth margin="normal" label="Confirm Password*" type="password" value={regData.confirmPassword}
              onChange={e => setRegData({...regData, confirmPassword: e.target.value})} required />
            <TextField fullWidth margin="normal" label="First name*" value={regData.first_name}
              onChange={e => setRegData({...regData, first_name: e.target.value})} required />
            <TextField fullWidth margin="normal" label="Last name*" value={regData.last_name}
              onChange={e => setRegData({...regData, last_name: e.target.value})} required />
            <TextField fullWidth margin="normal" label="Location" value={regData.location}
              onChange={e => setRegData({...regData, location: e.target.value})} />
            <TextField fullWidth margin="normal" label="Description" value={regData.description}
              onChange={e => setRegData({...regData, description: e.target.value})} />
            <TextField fullWidth margin="normal" label="Occupation" value={regData.occupation}
              onChange={e => setRegData({...regData, occupation: e.target.value})} />
            {regError && <Typography color="error">{regError}</Typography>}
            {regSuccess && <Typography color="green">{regSuccess}</Typography>}
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register Me</Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginRegister;