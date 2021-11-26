const { model, Schema } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  currentStock: {
    type: Number,
    default: 0,
  },
  createdAt: String,
});

module.exports = model('Item', itemSchema);
