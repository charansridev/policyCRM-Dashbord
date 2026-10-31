import React, { useState, useEffect } from 'react';
import { fetchAllPolicies } from '../api';
import { getWhatsAppReminderUrl } from '../utils/whatsapp';

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
            <div className="flex items-center gap-2">
              <a href={`tel:${policy.phone}`}
                className="flex items-center gap-1 text-[var(--color-primary)] text-[12px] font-semibold hover:underline">
                <span className="material-symbols-outlined text-[14px]">phone</span>
                {policy.phone}
              </a>
              <a
                href={getWhatsAppReminderUrl(policy)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                title="Send WhatsApp Reminder"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
