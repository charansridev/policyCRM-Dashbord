import React, { useState, useEffect } from 'react';
import { fetchAllPolicies } from '../api';

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

function PolicyBadge({ type }) {
  const cls = policyTypeColors[type] || policyTypeColors['Other'];
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${cls}`}>
      {type}
    </span>
  );
}

export default function AllPoliciesView() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await fetchAllPolicies();
        setPolicies(data);
      } catch (err) {
        console.error('Failed to fetch all policies', err);
      } finally {
        setLoading(false);
      }
    };
    loadPolicies();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[var(--color-outline-variant)] rounded-xl p-4 animate-pulse">
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)]" />
              <div className="space-y-2 flex-1 pt-1">
                <div className="h-4 w-32 bg-[var(--color-surface-container)] rounded-full" />
                <div className="h-3 w-20 bg-[var(--color-surface-container-low)] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-24 h-24 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)]">group</span>
        </div>
        <div>
          <h4 className="text-[18px] font-bold text-[var(--color-on-surface)]">No Policy Holders</h4>
          <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-1">There are no policies in the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest px-1">
        {policies.length} Total Policy Holder{policies.length !== 1 ? 's' : ''}
      </p>
      {policies.map((policy) => (
        <div key={policy._id} className="bg-white border border-[var(--color-outline-variant)] p-4 rounded-xl shadow-sm transition-transform hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-fixed)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-on-surface)]">{policy.name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <PolicyBadge type={policy.policyType} />
                  {policy.isRecurring && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                      {policy.recurringType === 'yearly' ? 'Yearly' : 'Monthly'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-bold text-[var(--color-on-surface)]">
                ₹ {policy.amount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-[var(--color-outline-variant)]">
            <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span className="text-[13px]">
                Due: {new Date(policy.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <a href={`tel:${policy.phone}`}
              className="flex items-center gap-1 text-[var(--color-primary)] text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">phone</span>
              {policy.phone}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
