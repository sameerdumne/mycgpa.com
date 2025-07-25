const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: String,
  gradePoint: Number,
  credits: Number
});

const sgpaSchema = new mongoose.Schema({
  semester: Number,
  subjects: [subjectSchema],
  sgpa: Number
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  sgpaRecords: [sgpaSchema]
});

module.exports = mongoose.model('User', userSchema);
