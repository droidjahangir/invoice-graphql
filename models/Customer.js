const { model, Schema } = require('mongoose');

const customerSchema = new Schema({
  username: {
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
  password: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
  createdAt: String,
});

module.exports = model('Customer', customerSchema);
