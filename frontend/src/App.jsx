import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import Dashboard from './components/Dashboard';
import AddPolicyModal from './components/AddPolicyModal';
import { fetchPolicies, fetchPayments, toUTCDateString } from './api';
import './index.css';

// ─── App Header ─────────────────────────────────────────────────────────────
function AppHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 glass-header text-white shadow-md flex items-center px-4 pt-4 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-xl">
          <span className="material-symbols-outlined text-white text-[22px]">shield</span>
        </div>
        <div>
          <h1 className="text-[20px] font-extrabold tracking-tight leading-tight">PolicyPay CRM</h1>
          <p className="text-[12px] text-white/70 leading-none font-medium">Daily Payment Tracker</p>
        </div>
      </div>
    </header>
  );
}

// ─── App Root ────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  const loadData = useCallback(async (date) => {
    setLoading(true);
    setPaymentsLoading(true);
    setError('');
    try {
      const [policyData, paymentData] = await Promise.all([
        fetchPolicies(date),
        fetchPayments(date),
      ]);
      setPolicies(policyData);
      setPayments(paymentData);
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
      setPaymentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  const handleDateChange = (newDate) => {
    newDate.setHours(0, 0, 0, 0);
    setSelectedDate(newDate);
  };

  const handleRemovePolicy = (id) => {
    setPolicies((prev) => prev.filter((p) => p._id !== id));
  };

  const handlePolicyDone = async (id) => {
    setPolicies((prev) => prev.filter((p) => p._id !== id));
    try {
      const paymentData = await fetchPayments(selectedDate);
      setPayments(paymentData);
    } catch (err) {
      console.error('Failed to update payments', err);
    }
  };

  const handlePolicyAdded = (newPolicy) => {
    const policyDate = toUTCDateString(new Date(newPolicy.dueDate));
    const currentDate = format(selectedDate, 'yyyy-MM-dd');
    if (policyDate === currentDate) {
      setPolicies((prev) => [newPolicy, ...prev]);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-background)]">
      <AppHeader />

      {/* Error Banner */}
      {error && (
        <div className="fixed top-[72px] left-0 right-0 z-40 mx-4 mt-2 bg-[var(--color-error-container)] border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-[var(--color-error)] text-[20px]">error</span>
          <p className="text-[var(--color-error)] text-sm flex-1">{error}</p>
          <button onClick={() => loadData(selectedDate)} className="text-[var(--color-error)] font-bold text-sm">
            Retry
          </button>
        </div>
      )}

      {/* Main content — padded for fixed header */}
      <main className="flex-1 flex flex-col pt-[72px] pb-4">
        <Dashboard
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          policies={policies}
          loading={loading}
          onRemovePolicy={handleRemovePolicy}
          onPolicyDone={handlePolicyDone}
          payments={payments}
          paymentsLoading={paymentsLoading}
        />
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        id="fab-add-policy"
        aria-label="Add new policy"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 bg-[var(--color-primary)] text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* Add Policy Modal */}
      {showModal && (
        <AddPolicyModal
          onClose={() => setShowModal(false)}
          onPolicyAdded={handlePolicyAdded}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}
