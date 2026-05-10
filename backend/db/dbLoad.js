require('dotenv').config({ path: '../../.env' }); // nếu .env ở thư mục gốc
const mongoose = require('mongoose');
const User = require('./userModel');
const Photo = require('./photoModel');
const bcrypt = require('bcrypt');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/photoapp';

const sampleUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    first_name: 'John',
    last_name: 'Doe',
    login_name: 'johnd',
    password: '123',
    location: 'New York',
    description: 'Loves hiking',
    occupation: 'Software Engineer'
  },
  {
    _id: new mongoose.Types.ObjectId(),
    first_name: 'Jane',
    last_name: 'Smith',
    login_name: 'janes',
    password: '123',
    location: 'London',
    description: 'Art enthusiast',
    occupation: 'Graphic Designer'
  }
];

const samplePhotos = [
  { _id: new mongoose.Types.ObjectId(), user_id: sampleUsers[0]._id, file_name: 'photo1.jpg', date_time: new Date(), comments: [] },
  { _id: new mongoose.Types.ObjectId(), user_id: sampleUsers[1]._id, file_name: 'photo2.jpg', date_time: new Date(), comments: [] }
];

async function load() {
  try {
    await mongoose.connect(mongoURI);
    await mongoose.connection.db.dropDatabase(); // Xóa hết dữ liệu cũ
    for (let u of sampleUsers) {
      const user = new User(u);
      await user.save(); // middleware pre('save') sẽ tự hash password
    }
    for (let p of samplePhotos) {
      const photo = new Photo(p);
      await photo.save();
    }
    console.log('✅ Database loaded with sample data');
  } catch (err) {
    console.error('❌ Error loading data:', err);
  } finally {
    await mongoose.disconnect();
  }
}
load();