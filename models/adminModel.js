const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
     type: String,
     required: true,
     unique: true
   },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  role: {
     type: String,
     default: 'Admin'
   } 
});

module.exports = mongoose.model('Admin', adminSchema);
