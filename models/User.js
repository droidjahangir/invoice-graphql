const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    index: true,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    trim: true,
  },
  createdAt: String,
});

module.exports = model('User', userSchema);
