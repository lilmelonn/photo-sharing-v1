// src/components/UserDetail/index.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';

function UserDetail({ onLoadUser }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data);
        if (onLoadUser) {
          onLoadUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.error || "Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, onLoadUser]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>Error: {error}</Typography>;
  }

  if (!user) {
    return <Typography sx={{ p: 2 }}>No user data found.</Typography>;
  }

  // Quan trọng: Render các thuộc tính của user, không phải object user
  return (
    <Card sx={{ maxWidth: 400, margin: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {user.occupation || 'No occupation provided'}
        </Typography>
        <Typography variant="body2">
          <strong>Location:</strong> {user.location || 'Not provided'}
          <br />
          <strong>Description:</strong> {user.description || 'No description provided'}
        </Typography>
        <Button
          component={Link}
          to={`/photos/${userId}`}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Show Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;