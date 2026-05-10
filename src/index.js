// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios'; // Đảm bảo bạn đã import axios

// --- CẤU HÌNH AXIOS TOÀN CỤC ---
// 'baseURL' là địa chỉ nền tảng cho tất cả các request
axios.defaults.baseURL = 'http://localhost:3000';
// 'withCredentials' mới là chìa khóa để gửi session cookie
axios.defaults.withCredentials = true;
// -----------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);