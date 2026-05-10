const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const photoSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file_name: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  comments: [commentSchema]
});

module.exports = mongoose.model('Photo', photoSchema);