const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password']
    },
    // Make these optional
    position: String,
    department: String,
    salary: Number,
    joiningDate: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);