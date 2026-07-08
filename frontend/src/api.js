import { format } from 'date-fns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = `${API_URL}/api/policies`;
const PAYMENT_API_BASE = `${API_URL}/api/payments`;

/**
 * Formats a JS Date to a UTC midnight ISO string (YYYY-MM-DD).
 */
export function toUTCDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Fetches pending policies for a given date.
 * @param {Date} date
 */
export async function fetchPolicies(date) {
  const dateStr = toUTCDateString(date);
  const res = await axios.get(API_BASE, { params: { date: dateStr } });
  return res.data;
}

/**
 * Fetches all policy holders.
 */
export async function fetchAllPolicies() {
  const res = await axios.get(`${API_BASE}/all`);
  return res.data;
}

/**
 * Creates a new policy.
 * @param {object} policyData
 */
export async function createPolicy(policyData) {
  const res = await axios.post(API_BASE, policyData);
  return res.data;
}

/**
 * Marks a policy as done (paid or advances date for recurring).
 * @param {string} id
 */
export async function markPolicyDone(id) {
  const res = await axios.put(`${API_BASE}/${id}/done`);
  return res.data;
}

/**
 * Forwards a policy to a new date.
 * @param {string} id
 * @param {Date} newDate
 */
export async function forwardPolicy(id, newDate) {
  const res = await axios.put(`${API_BASE}/${id}/forward`, {
    newDate: toUTCDateString(newDate),
  });
  return res.data;
}

/**
 * Fetches payment history for a given date.
 * @param {Date} date
 */
export async function fetchPayments(date) {
  const dateStr = toUTCDateString(date);
  const res = await axios.get(PAYMENT_API_BASE, { params: { date: dateStr } });
  return res.data;
}
