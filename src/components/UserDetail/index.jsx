import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function UserDetail({ onLoadUser }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/user/${userId}`)
      .then(res => {
        setUser(res.data);
        if (onLoadUser) onLoadUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('User not found');
        setLoading(false);
      });
  }, [userId, onLoadUser]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <Card sx={{ maxWidth: 400, margin: 2 }}>
      <CardContent>
        <Typography variant="h5">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography>Location: {user.location || 'Not provided'}</Typography>
        <Typography>Occupation: {user.occupation || 'Not provided'}</Typography>
        <Typography>Description: {user.description || 'No description'}</Typography>
        <Button variant="contained" component={Link} to={`/photos/${userId}`} sx={{ mt: 2 }}>
          Show Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;