const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  policyType: { type: String, required: true },
  amount: { type: Number, required: true },
  isRecurring: { type: Boolean, default: false },
  recurringType: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  // The original due date (the date payment was due)
  dueDate: { type: Date, required: true },
  // When the agent actually clicked Done
  paidAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
