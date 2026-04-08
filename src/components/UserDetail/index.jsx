import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";

import "./styles.css";
import models from "../../modelData/models";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  if (!user) {
    return (
      <Typography variant="body1" color="error">
        User not found!
      </Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              width: 80,
              height: 80,
              mr: 2,
              bgcolor: "primary.main",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" sx={{ color: "white" }}>
              {user.first_name.charAt(0)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" component="h1">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID: {user._id}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>📍 Location:</strong> {user.location}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>💼 Occupation:</strong> {user.occupation}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>📝 About:</strong> {user.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Button
          component={Link}
          to={`/photos/${userId}`}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;