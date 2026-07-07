const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const Payment = require('../models/Payment');

// GET /api/policies - Fetch pending policies for a specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    // Parse the date to ensure it's midnight UTC
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    const policies = await Policy.find({
      dueDate: {
        $gte: targetDate,
        $lt: nextDate,
      },
      status: 'pending',
    });

    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/policies - Create a new policy
router.post('/', async (req, res) => {
  try {
    const { name, phone, policyType, amount, isRecurring, dueDate } = req.body;
    
    const newPolicy = new Policy({
      name,
      phone,
      policyType,
      amount,
      isRecurring,
      dueDate: new Date(dueDate), // Ensure it's a date object
    });

    const savedPolicy = await newPolicy.save();
    res.status(201).json(savedPolicy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/policies/:id/done - Mark as paid or increment date if recurring
router.put('/:id/done', async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    if (policy.isRecurring) {
      const currentDue = new Date(policy.dueDate);
      if (policy.recurringType === 'yearly') {
        currentDue.setFullYear(currentDue.getFullYear() + 1);
      } else {
        currentDue.setMonth(currentDue.getMonth() + 1);
      }

      // Log the payment BEFORE updating the due date
      await Payment.create({
        policyId: policy._id,
        name: policy.name,
        phone: policy.phone,
        policyType: policy.policyType,
        amount: policy.amount,
        isRecurring: policy.isRecurring,
        recurringType: policy.recurringType,
        dueDate: policy.dueDate, // original due date
      });

      policy.dueDate = currentDue;
      // Status remains 'pending'
    } else {
      // Log the payment before marking paid
      await Payment.create({
        policyId: policy._id,
        name: policy.name,
        phone: policy.phone,
        policyType: policy.policyType,
        amount: policy.amount,
        isRecurring: policy.isRecurring,
        recurringType: policy.recurringType,
        dueDate: policy.dueDate,
      });

      policy.status = 'paid';
    }

    const updatedPolicy = await policy.save();
    res.json(updatedPolicy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/policies/:id/forward - Forward to a new date
router.put('/:id/forward', async (req, res) => {
  try {
    const { newDate } = req.body;
    if (!newDate) {
      return res.status(400).json({ error: 'newDate is required' });
    }

    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    policy.dueDate = new Date(newDate);
    const updatedPolicy = await policy.save();
    res.json(updatedPolicy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
