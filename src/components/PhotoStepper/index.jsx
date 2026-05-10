import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

function PhotoStepper({ photos, userId }) {
  const navigate = useNavigate();
  const { photoIndex } = useParams(); // deep link like /photos/:userId/:photoIndex
  const [current, setCurrent] = useState(photoIndex ? parseInt(photoIndex, 10) : 0);

  useEffect(() => {
    if (photoIndex === undefined && photos.length > 0) {
      // First time, set URL to index 0
      navigate(`/photos/${userId}/0`, { replace: true });
    }
  }, [photos, userId, photoIndex, navigate]);

  const handlePrev = () => {
    if (current > 0) {
      const newIdx = current - 1;
      setCurrent(newIdx);
      navigate(`/photos/${userId}/${newIdx}`);
    }
  };

  const handleNext = () => {
    if (current < photos.length - 1) {
      const newIdx = current + 1;
      setCurrent(newIdx);
      navigate(`/photos/${userId}/${newIdx}`);
    }
  };

  if (!photos.length) return <div>No photos</div>;
  const photo = photos[current];
  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
        <Button variant="contained" disabled={current === 0} onClick={handlePrev}>
          Previous
        </Button>
        <Typography>
          Photo {current + 1} of {photos.length}
        </Typography>
        <Button variant="contained" disabled={current === photos.length - 1} onClick={handleNext}>
          Next
        </Button>
      </Box>

      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 2 }}>
        <CardMedia
          component="img"
          image={`/images/${photo.file_name}`}
          alt={`Photo ${photo._id}`}
        />
        <CardContent>
          <Typography variant="caption">Taken on: {formatDate(photo.date_time)}</Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>Comments</Typography>
          <List dense>
            {photo.comments.map(comment => (
              <ListItem key={comment._id} alignItems="flex-start">
                <ListItemText
                  primary={<Link to={`/users/${comment.user._id}`}>
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>}
                  secondary={
                    <>
                      <Typography variant="caption">{formatDate(comment.date_time)}</Typography>
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
    </div>
  );
}

export default PhotoStepper;