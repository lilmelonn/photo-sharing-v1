import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Modal, Box, Button, Typography, CircularProgress } from '@mui/material';

const BACKEND_URL = 'http://localhost:3000';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function PhotoUploadModal({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      await axios.post(`${BACKEND_URL}/photos/new`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      // Reset input và state
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFile(null);
      onUploaded(); // refresh danh sách ảnh
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Upload Photo</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default PhotoUploadModal;