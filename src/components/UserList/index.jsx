import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import fetchModel from '../../lib/fetchModelData';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 useEffect - bắt đầu gọi fetchModel");
    fetchModel('/user/list')
      .then(response => {
        console.log("✅ fetchModel thành công, response:", response);
        console.log("📦 response.data:", response.data);
        console.log("📏 Kiểu dữ liệu của response.data:", typeof response.data);
        console.log("🔢 Có phải mảng không?", Array.isArray(response.data));
        
        // Ép kiểu an toàn
        const data = Array.isArray(response.data) ? response.data : [];
        console.log("🛠 Sau ép kiểu, data =", data);
        
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ fetchModel thất bại:", err);
        setUsers([]);
        setLoading(false);
      });
  }, []);

  console.log("🔄 Render UserList, loading =", loading, "users =", users);

  if (loading) {
    return <div>⏳ Loading users...</div>;
  }

  const safeUsers = users || [];
  console.log("👥 Số lượng user an toàn:", safeUsers.length);

  if (safeUsers.length === 0) {
    return (
      <List component="nav">
        <ListItem>
          <ListItemText primary="⚠️ No users found." />
        </ListItem>
      </List>
    );
  }

  return (
    <List component="nav">
      {safeUsers.map(user => (
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