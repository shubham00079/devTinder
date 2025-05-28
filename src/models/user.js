const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "others"].includes(value)){
        throw new Error("gender data is not valid");
      }
    } 
  },
  about: {
    type: String,
    default: 'Good boy',
  },
  skills: {
    type: [String],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;