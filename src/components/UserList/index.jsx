import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';

// Cấu hình axios nếu chưa có ở nơi khác (có thể đặt ở index.js)
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("🔍 Gọi API /user/list");
    axios.get('/user/list')
      .then(response => {
        console.log("✅ Dữ liệu nhận:", response.data);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Lỗi khi gọi user list:", err);
        setError(err.response?.data?.error || err.message);
        setUsers([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>⏳ Loading users...</div>;
  if (error) return <div>⚠️ Error: {error}</div>;
  if (users.length === 0) return <div>⚠️ No users found.</div>;

  return (
    <List component="nav">
      {users.map(user => (
        <ListItem
          button
          key={user._id}
          component={Link}
          to={`/users/${user._id}`}
        >
          <ListItemText primary={`${user.first_name} ${user.last_name}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default UserList;