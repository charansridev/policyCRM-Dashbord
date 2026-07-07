import React, { useState } from 'react';
import { format, addDays, subDays, differenceInCalendarDays } from 'date-fns';
import { markPolicyDone, forwardPolicy } from '../api';
import HistoryView from './HistoryView';
import CalendarPicker from './CalendarPicker';

// ─── Policy Type Badge ───────────────────────────────────────────────────────
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

// ─── Due Status Label ────────────────────────────────────────────────────────
function DueStatus({ dueDate, selectedDate }) {
  const diff = differenceInCalendarDays(new Date(dueDate), selectedDate);
  if (diff === 0) return <span className="text-[11px] font-semibold text-[var(--color-primary)]">Due today</span>;
  if (diff > 0) return <span className="text-[11px] font-semibold text-[var(--color-on-surface-variant)]">Due in {diff} day{diff !== 1 ? 's' : ''}</span>;
  return <span className="text-[11px] font-semibold text-[var(--color-error)]">Overdue by {Math.abs(diff)} day{Math.abs(diff) !== 1 ? 's' : ''}</span>;
}

// ─── Forward Date Modal ──────────────────────────────────────────────────────
function ForwardModal({ policy, onClose, onForwarded }) {
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const [newDate, setNewDate] = useState(tomorrow);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forwardPolicy(policy._id, new Date(newDate));
      onForwarded(policy._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-[var(--color-outline-variant)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[var(--color-tertiary-fixed)] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-on-tertiary-fixed-variant)] text-[20px]">forward</span>
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-on-surface)] text-lg">Forward Payment</h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm">{policy.name}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
              New Due Date
            </label>
            <input
              type="date"
              value={newDate}
              min={tomorrow}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="w-full bg-white border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] font-bold hover:bg-[var(--color-surface-container-low)] transition-colors active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed-variant)] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
              {loading
                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <><span className="material-symbols-outlined text-[18px]">forward</span> Forward</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Policy Card ─────────────────────────────────────────────────────────────
function PolicyCard({ policy, onRemove, onPolicyDone, selectedDate }) {
  const [isDone, setIsDone] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [doneLoading, setDoneLoading] = useState(false);

  const handleDone = async () => {
    setDoneLoading(true);
    try {
      await markPolicyDone(policy._id);
      setIsDone(true);
      setTimeout(() => onPolicyDone(policy._id), 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setDoneLoading(false);
    }
  };

  return (
    <>
      <div className={`card overflow-hidden transition-all duration-500 ${isDone ? 'opacity-50 scale-95' : 'hover:shadow-md'}`}>
        <div className="p-4 space-y-3">
          {/* Top Row: Avatar + Name + Amount */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-[var(--color-surface-container-low)] rounded-xl flex items-center justify-center border border-[var(--color-outline-variant)] flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-[22px]">person</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[var(--color-on-surface)] leading-tight">{policy.name}</h3>
                <a href={`tel:${policy.phone}`} className="flex items-center gap-1 text-[var(--color-on-surface-variant)] mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">phone</span>
                  <span className="text-[13px]">{policy.phone}</span>
                </a>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[20px] font-bold text-[var(--color-on-surface)]">
                ₹ {policy.amount.toLocaleString('en-IN')}
              </div>
              {policy.isRecurring && (
                <span className="text-[11px] font-semibold bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-md">
                  {policy.recurringType === 'yearly' ? 'Yearly' : 'Monthly'}
                </span>
              )}
            </div>
          </div>

          {/* Policy Badge + Due Status */}
          <div className="flex items-center gap-2">
            <PolicyBadge type={policy.policyType} />
            <div className="w-1 h-1 rounded-full bg-[var(--color-outline-variant)]" />
            <DueStatus dueDate={policy.dueDate} selectedDate={selectedDate} />
          </div>
        </div>

        {/* Done / Forward Buttons */}
        {isDone ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border-t border-green-200 text-green-700 font-bold text-sm">
            <span className="material-symbols-outlined text-green-500 text-[18px]" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>
            {policy.isRecurring
              ? policy.recurringType === 'yearly' ? 'Advanced to next year!' : 'Advanced to next month!'
              : 'Marked as Paid!'}
          </div>
        ) : (
          <div className="flex border-t border-[var(--color-outline-variant)] divide-x divide-[var(--color-outline-variant)]">
            <button
              onClick={handleDone}
              disabled={doneLoading}
              id={`done-btn-${policy._id}`}
              className="flex-1 py-3.5 bg-[var(--color-secondary)] hover:bg-[var(--color-on-secondary-fixed-variant)] text-white font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 text-sm"
            >
              {doneLoading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span className="material-symbols-outlined text-[18px]">check_circle</span> Done</>}
            </button>
            <button
              onClick={() => setShowForwardModal(true)}
              id={`forward-btn-${policy._id}`}
              className="flex-1 py-3.5 bg-[var(--color-tertiary-fixed)] hover:bg-[var(--color-tertiary-fixed-dim)] text-[var(--color-on-tertiary-fixed-variant)] font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">forward</span> Forward
            </button>
          </div>
        )}
      </div>

      {showForwardModal && (
        <ForwardModal
          policy={policy}
          onClose={() => setShowForwardModal(false)}
          onForwarded={(id) => { setShowForwardModal(false); onRemove(id); }}
        />
      )}
    </>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-[var(--color-surface-container)] rounded-xl" />
          <div className="space-y-2 pt-1">
            <div className="h-4 w-32 bg-[var(--color-surface-container)] rounded-full" />
            <div className="h-3 w-24 bg-[var(--color-surface-container-low)] rounded-full" />
          </div>
        </div>
        <div className="h-6 w-16 bg-[var(--color-surface-container)] rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-[var(--color-surface-container-low)] rounded" />
        <div className="h-5 w-16 bg-[var(--color-surface-container-low)] rounded-full" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="flex-1 h-11 bg-[var(--color-surface-container)] rounded-lg" />
        <div className="flex-1 h-11 bg-[var(--color-surface-container-low)] rounded-lg" />
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard({ selectedDate, onDateChange, policies, loading, onRemovePolicy, onPolicyDone, payments, paymentsLoading }) {
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const [activeTab, setActiveTab] = useState('pending');
  const [showCalendar, setShowCalendar] = useState(false);

  React.useEffect(() => {
    setActiveTab('pending');
  }, [selectedDate]);

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0">

        {/* ── Date Navigation ── */}
        <div className="bg-[var(--color-background)] px-4 pt-4 pb-0 space-y-3">

          {/* Jump to Date */}
          <div className="flex items-center justify-between">
            <button
              id="pick-date-btn"
              onClick={() => setShowCalendar(true)}
              className="bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-highest)] text-[var(--color-primary)] font-semibold text-[12px] px-4 py-2 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              Jump to Date
            </button>
            {isToday && (
              <span className="text-[11px] font-bold text-[var(--color-primary)] bg-[var(--color-primary-fixed)] px-3 py-1 rounded-full">
                Today
              </span>
            )}
          </div>

          {/* Day Navigator */}
          <div className="bg-white border border-[var(--color-outline-variant)] rounded-2xl px-3 py-3 flex items-center justify-between shadow-sm">
            <button
              onClick={() => onDateChange(subDays(selectedDate, 1))}
              id="prev-day-btn"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container)] transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">chevron_left</span>
            </button>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[var(--color-outline)] uppercase tracking-widest">
                {activeTab === 'history' ? 'Viewing History for' : 'Payments Due'}
              </p>
              <p className="text-[16px] font-bold text-[var(--color-on-surface)] mt-0.5">
                {format(selectedDate, 'EEEE, dd MMM yyyy')}
              </p>
            </div>
            <button
              onClick={() => onDateChange(addDays(selectedDate, 1))}
              id="next-day-btn"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container)] transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">chevron_right</span>
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-[var(--color-outline-variant)]">
            <button
              id="tab-pending"
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 text-[13px] font-bold relative transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Pending
              {policies.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'pending' ? 'bg-[var(--color-primary-fixed)] text-[var(--color-primary)]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                }`}>{policies.length}</span>
              )}
              {activeTab === 'pending' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-sm bg-[var(--color-primary)]" />
              )}
            </button>
            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-[13px] font-bold relative transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'text-[var(--color-secondary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              History
              {payments.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-green-100 text-green-700' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                }`}>{payments.length}</span>
              )}
              {activeTab === 'history' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-sm bg-[var(--color-secondary)]" />
              )}
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-4">
          {activeTab === 'history' ? (
            <HistoryView payments={payments} loading={paymentsLoading} />
          ) : loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : policies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-24 h-24 bg-[var(--color-surface-container)] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)]">calendar_today</span>
              </div>
              <div>
                <h4 className="text-[20px] font-bold text-[var(--color-on-surface)]">All Clear!</h4>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] mt-1">No pending payments for this day</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-widest px-1">
                {policies.length} pending payment{policies.length !== 1 ? 's' : ''}
              </p>
              {policies.map((policy) => (
                <PolicyCard
                  key={policy._id}
                  policy={policy}
                  onRemove={onRemovePolicy}
                  onPolicyDone={onPolicyDone}
                  selectedDate={selectedDate}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Sticky Total Collected (History tab) ── */}
        {activeTab === 'history' && payments.length > 0 && (
          <div className="sticky bottom-0 left-0 w-full bg-[var(--color-on-secondary-fixed-variant)] text-[var(--color-secondary-fixed)] py-3 px-4 flex items-center justify-center gap-2 z-10">
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings:"'FILL' 1"}}>verified</span>
            <span className="text-[15px] font-bold">
              Total Collected ₹ {totalCollected.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Calendar Picker Modal */}
      {showCalendar && (
        <CalendarPicker
          selectedDate={selectedDate}
          onSelect={(date) => {
            date.setHours(0, 0, 0, 0);
            onDateChange(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </>
  );
}
