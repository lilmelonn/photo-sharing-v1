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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PhotoStepper from '../PhotoStepper';

function UserPhotos({ onLoadPhotos, advanced = false, refreshKey = 0 }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        // Gọi đồng thời hai API
        const [photosRes, userRes] = await Promise.all([
          axios.get(`/photosOfUser/${userId}`),
          axios.get(`/user/${userId}`)
        ]);
        if (isMounted) {
          setPhotos(photosRes.data);
          if (onLoadPhotos) onLoadPhotos(userRes.data);
          setError('');
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to load photos');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [userId, onLoadPhotos, refreshKey]);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <Typography color="error" sx={{ p: 2 }}>Error: {error}</Typography>;
  if (advanced) return <PhotoStepper photos={photos} userId={userId} />;

  return (
    <div style={{ padding: 16 }}>
      <Grid container spacing={3}>
        {photos.map(photo => (
          <Grid item xs={12} md={6} key={photo._id}>
            <Card>
              <CardMedia
                component="img"
                image={`/images/${photo.file_name}`}
                alt={`Photo ${photo._id}`}
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
              />
              <CardContent>
                <Typography variant="caption">
                  Taken on: {formatDate(photo.date_time)}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Comments
                </Typography>
                <List dense>
                  {photo.comments && photo.comments.length > 0 ? (
                    photo.comments.map(comment => (
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
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No comments yet.
                    </Typography>
                  )}
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