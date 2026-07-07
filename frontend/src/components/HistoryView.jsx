import React from 'react';
import { format } from 'date-fns';

const policyTypeColors = {
  'Jeevan Anand':        'bg-purple-100 text-purple-700',
  'Jeevan Umang':        'bg-indigo-100 text-indigo-700',
  'Jeevan Labh':         'bg-blue-100 text-blue-700',
  'Money Back Policy':   'bg-emerald-100 text-emerald-700',
  'Term Assurance':      'bg-orange-100 text-orange-700',
  'Endowment Plan':      'bg-amber-100 text-amber-700',
  "Children's Money Back": 'bg-pink-100 text-pink-700',
  'Other':               'bg-gray-100 text-gray-600',
};

function PaymentCard({ payment }) {
  const paidTime = format(new Date(payment.paidAt), 'hh:mm a');
  const badgeCls = policyTypeColors[payment.policyType] || policyTypeColors['Other'];

  return (
    <div className="bg-[#f0fdf4] border border-green-200 p-4 rounded-xl shadow-sm transition-transform active:scale-[0.98]">
      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center text-[var(--color-on-secondary-container)] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[var(--color-on-surface)]">{payment.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${badgeCls}`}>
                {payment.policyType}
              </span>
              {payment.isRecurring && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--color-on-secondary-container)]/10 text-[var(--color-on-secondary-container)]">
                  {payment.recurringType === 'yearly' ? 'Yearly' : 'Monthly'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-bold text-[var(--color-on-secondary-container)]">
            ₹ {payment.amount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Footer: time + phone */}
      <div className="flex items-center justify-between pt-3 border-t border-green-200/60">
        <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span className="text-[13px]">Paid at {paidTime}</span>
        </div>
        <a href={`tel:${payment.phone}`}
          className="flex items-center gap-1 text-[var(--color-primary)] text-[12px] font-semibold">
          <span className="material-symbols-outlined text-[14px]">phone</span>
          {payment.phone}
        </a>
      </div>
    </div>
  );
}

export default function HistoryView({ payments, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-green-50 border border-green-100 rounded-xl p-4 animate-pulse">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-200" />
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-4 w-28 bg-green-200 rounded-full" />
                <div className="h-3 w-20 bg-green-100 rounded-full" />
              </div>
              <div className="h-6 w-14 bg-green-200 rounded-full" />
            </div>
            <div className="h-px bg-green-200 mb-3" />
            <div className="h-4 w-32 bg-green-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-24 h-24 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)]">history</span>
        </div>
        <div>
          <h4 className="text-[18px] font-bold text-[var(--color-on-surface)]">No History</h4>
          <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">No payments were recorded on this day</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest px-1">
        {payments.length} payment{payments.length !== 1 ? 's' : ''} collected
      </p>
      {payments.map((payment) => (
        <PaymentCard key={payment._id} payment={payment} />
      ))}
    </div>
  );
}
