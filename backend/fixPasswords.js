require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./db/userModel');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/photoapp';

async function fixPasswords() {
  await mongoose.connect(mongoURI);
  const users = await User.find({});
  for (let u of users) {
    if (!u.password.startsWith('$2b$')) {
      const hashed = await bcrypt.hash(u.password, 10);
      u.password = hashed;
      await u.save();
      console.log(`✅ fixed ${u.login_name}`);
    }
  }
  console.log('Done');
  mongoose.disconnect();
}
fixPasswords();