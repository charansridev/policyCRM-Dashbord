/**
 * Generates an official WhatsApp Click-to-Chat (wa.me) URL with a customized pre-filled message.
 * @param {Object} policy
 * @param {string} policy.name - Customer's name
 * @param {string} policy.phone - Customer's mobile number
 * @param {string} policy.policyType - Policy type (e.g., Jeevan Anand)
 * @param {number} policy.amount - Premium amount
 * @param {string|Date} policy.dueDate - Premium due date
 * @returns {string} WhatsApp direct chat URL
 */
export function getWhatsAppReminderUrl(policy) {
  if (!policy || !policy.phone) return '#';

  // Strip any non-digit character (spaces, dashes, parentheses, plus signs)
  let cleanPhone = policy.phone.toString().replace(/\D/g, '');

  // Default to India country code (91) if a 10-digit mobile number is provided
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const dueDateFormatted = policy.dueDate
    ? new Date(policy.dueDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'today';

  const amountFormatted = Number(policy.amount || 0).toLocaleString('en-IN');

  const message = `Hello ${policy.name},

This is a gentle reminder that your life insurance premium is due for payment.

📋 *Policy:* ${policy.policyType}
💰 *Amount Due:* ₹${amountFormatted}
📅 *Due Date:* ${dueDateFormatted}

Kindly process the renewal payment to ensure uninterrupted coverage. Please let me know once done!

Thank you 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
