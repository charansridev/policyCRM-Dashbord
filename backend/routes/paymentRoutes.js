const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// GET /api/payments?date=YYYY-MM-DD
// Returns all payments logged on a specific date (based on dueDate)
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    const payments = await Payment.find({
      dueDate: {
        $gte: targetDate,
        $lt: nextDate,
      },
    }).sort({ paidAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
