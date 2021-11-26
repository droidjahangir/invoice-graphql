const { model, Schema } = require('mongoose');

const invoiceSchema = new Schema({
  user: {
    _id: {
      type: String,
      index: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    role: String,
  },
  items: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalBill: {
    type: Number,
    required: true,
  },
  invoiceId: {
    type: String,
    required: true,
  },
  createdAt: String,
});

module.exports = model('Invoice', invoiceSchema);
