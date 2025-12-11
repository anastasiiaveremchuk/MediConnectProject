const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Будь ласка, додайте імʼя'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Будь ласка, додайте прізвище'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Будь ласка, використовуйте правильний email'],
  },
  phoneNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Patient', patientSchema);