import React, { useState } from 'react';
import axios from 'axios';
function PhotoUploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    await axios.post('/photos/new', formData);
    onUploaded();
    onClose();
  };
  return ( ... )
}