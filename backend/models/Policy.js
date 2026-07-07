const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  policyType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringType: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
