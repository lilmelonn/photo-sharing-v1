const mongoose = require('mongoose');

const schemaInfoSchema = new mongoose.Schema({
  __v: Number,
  load_date_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SchemaInfo', schemaInfoSchema);