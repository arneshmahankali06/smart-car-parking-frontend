import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyBookings } from '../api/bookingApi';
import { processPayment } from '../api/paymentApi';
import { CreditCard, Smartphone, Wallet, Banknote, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const methods = [
  { value: 'UPI',    label: 'UPI',         icon: <Smartphone size={20} />,  desc: 'Google Pay, PhonePe, Paytm' },
  { value: 'CARD',   label: 'Card',        icon: <CreditCard size={20} />,  desc: 'Credit / Debit Card' },
  { value: 'WALLET', label: 'Wallet',      icon: <Wallet size={20} />,      desc: 'Paytm, Amazon Pay' },
  { value: 'CASH',   label: 'Cash',        icon: <Banknote size={20} />,    desc: 'Pay at exit counter' },
];

export default function PaymentPage() {
  const location  = useLocation();
  const navigate   = useNavigate();
  const booking    = location.state?.booking;
  const [myBookings, setMyBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(booking || null);
  const [method,  setMethod]  = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [txn,     setTxn]     = useState(null);

  useEffect(() => {
    if (!booking) {
      getMyBookings().then(b => setMyBookings(b.filter(x => x.status === 'CONFIRMED')));
    }
  }, [booking]);

  const estimateAmount = (b) => {
    if (!b) return 0;
    const hrs = (new Date(b.endTime) - new Date(b.startTime)) / 3600000;
    return Math.max(30, (hrs * 30)).toFixed(2);
  };

  const handlePay = async () => {
    if (!selectedBooking) { toast.error('Select a booking to pay'); return; }
    setLoading(true);
    try {
      const payment = await processPayment({
        bookingId: selectedBooking.id,
        amount:    parseFloat(estimateAmount(selectedBooking)),
        method,
      });
      setTxn(payment);
      setDone(true);
      toast.success('Payment successful! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (done && txn) {
    return (
      <div className="page-wrapper">
        <div className="page-content" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '40px auto 20px',
              boxShadow: '0 16px 48px rgba(56,239,125,0.35)',
            }}>
              <CheckCircle size={40} color="#fff" />
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
              Payment Successful!
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Your parking has been paid. Thank you!
            </p>
            <div className="card" style={{ textAlign: 'left', marginBottom: 24 }}>
              {[
                ['Transaction Ref', txn.transactionRef],
                ['Amount',          `₹ ${txn.amount}`],
                ['Method',          txn.method],
                ['Status',          <span className="badge badge-paid">PAID</span>],
                ['Paid At',         new Date(txn.paidAt).toLocaleString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Make Payment</h1>
            <p className="section-subtitle">Choose your payment method</p>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          <div className="card" style={{ padding: 36 }}>
            {/* Select booking if not pre-selected */}
            {!booking && (
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label">Select Booking</label>
                <select
                  id="payment-booking-select"
                  className="form-input"
                  value={selectedBooking?.id || ''}
                  onChange={e => setSelectedBooking(myBookings.find(b => b.id === Number(e.target.value)) || null)}
                >
                  <option value="">Select a confirmed booking…</option>
                  {myBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      #{b.id} — {b.slotNumber} — {b.vehicleNumber}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Payment Methods */}
            <p className="form-label" style={{ marginBottom: 12 }}>Payment Method</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {methods.map(m => (
                <button
                  key={m.value}
                  id={`payment-method-${m.value.toLowerCase()}`}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  style={{
                    padding: 16, borderRadius: 12, border: `2px solid ${method === m.value ? 'var(--accent-blue)' : 'var(--border)'}`,
                    background: method === m.value ? 'rgba(99,179,237,0.1)' : 'var(--bg-glass)',
                    cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)',
                  }}
                >
                  <div style={{ color: method === m.value ? 'var(--accent-blue)' : 'var(--text-secondary)', marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{m.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </button>
              ))}
            </div>

            <button
              id="pay-now-btn"
              className="btn btn-green btn-full"
              style={{ padding: '14px' }}
              onClick={handlePay}
              disabled={loading || !selectedBooking}
            >
              {loading
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
                : <><CreditCard size={17} /> Pay ₹{estimateAmount(selectedBooking)}</>}
            </button>
          </div>

          {/* Summary */}
          {selectedBooking && (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Payment Summary</h3>
              {[
                ['Booking ID', `#${selectedBooking.id}`],
                ['Slot', `${selectedBooking.slotNumber} (Floor ${selectedBooking.floor})`],
                ['Vehicle', selectedBooking.vehicleNumber],
                ['Duration', `${((new Date(selectedBooking.endTime) - new Date(selectedBooking.startTime)) / 3600000).toFixed(1)} hrs`],
                ['Amount', `₹ ${estimateAmount(selectedBooking)}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div className="alert alert-warning" style={{ marginTop: 20 }}>
                🔐 Simulated payment — no real money is charged
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
