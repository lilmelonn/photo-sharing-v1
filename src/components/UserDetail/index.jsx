import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import fetchModel from '../../lib/fetchModelData';

function UserDetail({ onLoadUser }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // For Problem 1: const userData = window.cs142Models.userModel(userId);
    fetchModel(`/user/${userId}`)
      .then(response => {
        setUser(response.data);
        if (onLoadUser) onLoadUser(response.data);
      })
      .catch(err => console.error('Failed to load user:', err));
  }, [userId, onLoadUser]);

  if (!user) return <div>Loading user...</div>;

  return (
    <Card sx={{ maxWidth: 400, margin: 2 }}>
      <CardContent>
        <Typography variant="h5">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography>Location: {user.location}</Typography>
        <Typography>Occupation: {user.occupation}</Typography>
        <Typography>Description: {user.description}</Typography>
        <Button
          variant="contained"
          component={Link}
          to={`/photos/${userId}`}
          sx={{ mt: 2 }}
        >
          Show Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;