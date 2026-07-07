import React, { useState } from 'react';
import { format } from 'date-fns';
import { createPolicy } from '../api';

const POLICY_TYPES = [
  'Jeevan Anand', 'Jeevan Umang', 'Jeevan Labh',
  'Money Back Policy', 'Term Assurance', 'Endowment Plan',
  "Children's Money Back", 'Other',
];

function FieldLabel({ children }) {
  return (
    <label className="block text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1 mb-1.5">
      {children}
    </label>
  );
}

function InputWithIcon({ icon, children }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-[20px] pointer-events-none">
        {icon}
      </span>
      {React.cloneElement(children, {
        className: `${children.props.className} pl-11`
      })}
    </div>
  );
}

const baseInput = "w-full bg-white border border-[var(--color-outline-variant)] rounded-xl py-3.5 pr-4 text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all text-[15px]";

export default function AddPolicyModal({ onClose, onPolicyAdded, selectedDate }) {
  const today = format(selectedDate, 'yyyy-MM-dd');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    policyType: POLICY_TYPES[0],
    amount: '',
    dueDate: today,
    isRecurring: false,
    recurringType: 'monthly',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), dueDate: `${form.dueDate}T00:00:00.000Z` };
      const newPolicy = await createPolicy(payload);
      onPolicyAdded(newPolicy);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] glass-panel rounded-t-[2rem] border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.12)] overflow-y-auto max-h-[92dvh]">
        {/* Pull Bar */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-[var(--color-outline)]/20 rounded-full" />
        </div>

        <div className="px-5 pb-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[22px] font-bold text-[var(--color-on-background)]">Add New Policy</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <InputWithIcon icon="person">
                <input name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="e.g. Rahul Gupta" required className={baseInput} />
              </InputWithIcon>
            </div>

            {/* Phone */}
            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <InputWithIcon icon="call">
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" required className={baseInput} />
              </InputWithIcon>
            </div>

            {/* Policy Type */}
            <div>
              <FieldLabel>Policy Type</FieldLabel>
              <InputWithIcon icon="category">
                <select name="policyType" value={form.policyType} onChange={handleChange}
                  required className={`${baseInput} appearance-none cursor-pointer`}>
                  {POLICY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputWithIcon>
            </div>

            {/* Amount + Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Amount ₹</FieldLabel>
                <input name="amount" type="number" value={form.amount} onChange={handleChange}
                  placeholder="0.00" min="1" required
                  className={`${baseInput} px-4`} />
              </div>
              <div>
                <FieldLabel>Initial Due Date</FieldLabel>
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange}
                  required className={`${baseInput} px-4`} />
              </div>
            </div>

            {/* Recurring Toggle */}
            <div className="flex items-center justify-between bg-white border border-[var(--color-outline-variant)] rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-[22px]">event_repeat</span>
                <div>
                  <p className="text-[14px] font-bold text-[var(--color-on-surface)]">Recurring Payment</p>
                  <p className="text-[11px] text-[var(--color-outline)]">Automated cycle</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={form.isRecurring}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[var(--color-surface-container-highest)] rounded-full peer
                  peer-checked:bg-[var(--color-primary)]
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                  after:bg-white after:border after:border-gray-300 after:rounded-full
                  after:h-5 after:w-5 after:transition-all
                  peer-checked:after:translate-x-5 peer-checked:after:border-white" />
              </label>
            </div>

            {/* Frequency: Monthly / Yearly */}
            {form.isRecurring && (
              <div className="grid grid-cols-2 gap-3">
                {['monthly', 'yearly'].map((val) => (
                  <label key={val} className="relative cursor-pointer">
                    <input type="radio" name="recurringType" value={val}
                      checked={form.recurringType === val} onChange={handleChange}
                      className="peer sr-only" />
                    <div className={`p-4 rounded-xl border text-center transition-all
                      peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary-fixed)] peer-checked:text-[var(--color-primary)]
                      border-[var(--color-outline-variant)] bg-white text-[var(--color-on-surface-variant)]`}>
                      <p className="text-[14px] font-bold capitalize">{val}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-[var(--color-error-container)] border border-red-200 text-[var(--color-error)] text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-4 rounded-xl border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] font-bold hover:bg-[var(--color-surface-container-low)] transition-colors active:scale-95">
                Cancel
              </button>
              <button type="submit" disabled={loading} id="submit-policy-btn"
                className="flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg, #004ac6, #2563eb)' }}>
                {loading
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><span className="material-symbols-outlined text-[18px]">add</span> Add Policy</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
