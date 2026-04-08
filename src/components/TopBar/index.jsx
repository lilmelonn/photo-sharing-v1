import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function TopBar({ title }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Hoang Thanh Duong
        </Typography>
        <Typography variant="subtitle1">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}