import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PhotoStepper from '../PhotoStepper';

function UserPhotos({ onLoadPhotos, advanced = false, refreshKey = 0 }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    // Lấy danh sách ảnh của user
    axios.get(`/photosOfUser/${userId}`)
      .then(response => {
        setPhotos(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load photos:', err);
        setError(err.response?.data?.error || 'Failed to load photos');
        setLoading(false);
      });

    // Lấy thông tin user để cập nhật TopBar
    axios.get(`/user/${userId}`)
      .then(userRes => {
        if (onLoadPhotos) onLoadPhotos(userRes.data);
      })
      .catch(err => console.error('Failed to load user for TopBar:', err));
  }, [userId, onLoadPhotos, refreshKey]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  if (loading) return <div>Loading photos...</div>;
  if (error) return <div>Error: {error}</div>;

  // Chế độ Stepper (Extra Credit)
  if (advanced) {
    return <PhotoStepper photos={photos} userId={userId} />;
  }

  // Chế độ bình thường: lưới ảnh
  return (
    <div style={{ padding: 16 }}>
      <Grid container spacing={3}>
        {photos.map(photo => (
          <Grid item xs={12} md={6} key={photo._id}>
            <Card>
              <CardMedia
                component="img"
                image={`http://localhost:3000/images/${photo.file_name}`}
                alt={`Photo ${photo._id}`}
              />
              <CardContent>
                <Typography variant="caption">
                  Taken on: {formatDate(photo.date_time)}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Comments
                </Typography>
                <List dense>
                  {photo.comments.map(comment => (
                    <ListItem key={comment._id} alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Link to={`/users/${comment.user._id}`}>
                            {comment.user.first_name} {comment.user.last_name}
                          </Link>
                        }
                        secondary={
                          <>
                            <Typography variant="caption">
                              {formatDate(comment.date_time)}
                            </Typography>
                            <br />
                            {comment.comment}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserPhotos;