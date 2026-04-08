import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId } = useParams();
  
  // Kiểm tra dữ liệu trước khi dùng
  const photos = models.photoOfUserModel(userId) || [];
  const user = models.userModel(userId);

  // Nếu đang loading hoặc chưa có dữ liệu
  if (!photos) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Kiểm tra nếu không có ảnh
  if (photos.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        This user hasn't uploaded any photos yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {user?.first_name || 'User'} {user?.last_name || ''}'s Photos
      </Typography>
      
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ maxWidth: 600, marginBottom: 4 }}>
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
            alt={`Photo by ${user?.first_name || 'User'}`}
            sx={{ maxHeight: 500, objectFit: "contain" }}
          />
          
          <CardContent>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              📅 Posted: {photo.date_time ? new Date(photo.date_time).toLocaleString() : 'Unknown date'}
            </Typography>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              💬 Comments ({photo.comments?.length || 0}):
            </Typography>
            
            <List dense>
              {photo.comments && photo.comments.length > 0 ? (
                photo.comments.map((comment) => (
                  <ListItem key={comment._id} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography component="span" variant="body2">
                          <Link 
                            to={`/users/${comment.user?._id}`}
                            style={{ textDecoration: "none", fontWeight: "bold" }}
                          >
                            {comment.user?.first_name || 'Unknown'} {comment.user?.last_name || ''}
                          </Link>
                          {" · "}
                          {comment.date_time ? new Date(comment.date_time).toLocaleString() : 'Unknown date'}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.primary">
                          {comment.comment || 'No comment text'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No comments yet."
                    secondary="Be the first to comment!"
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;