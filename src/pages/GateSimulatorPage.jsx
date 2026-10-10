import { useState } from 'react';
import { gateEntry, gateExit, getGateHistory } from '../api/adminApi';
import { LogIn, LogOut, Search, Gauge } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GateSimulatorPage() {
  const [bookingId, setBookingId] = useState('');
  const [history,   setHistory]   = useState(null);
  const [loading,   setLoading]   = useState({ entry: false, exit: false, search: false });

  const withLoad = async (key, fn) => {
    setLoading(l => ({ ...l, [key]: true }));
    try { await fn(); } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(l => ({ ...l, [key]: false }));
    }
  };

  const handleEntry = () => withLoad('entry', async () => {
    if (!bookingId) { toast.error('Enter a Booking ID'); return; }
    const h = await gateEntry(Number(bookingId));
    setHistory(h);
    toast.success('🚦 Gate OPEN — Vehicle entered! Slot marked OCCUPIED.');
  });

  const handleExit = () => withLoad('exit', async () => {
    if (!bookingId) { toast.error('Enter a Booking ID'); return; }
    const h = await gateExit(Number(bookingId));
    setHistory(h);
    toast.success('🚦 Gate OPEN — Vehicle exited! Slot is now AVAILABLE.');
  });

  const handleSearch = () => withLoad('search', async () => {
    if (!bookingId) { toast.error('Enter a Booking ID'); return; }
    const h = await getGateHistory(Number(bookingId));
    setHistory(h);
  });

  const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }) : '—';

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Gate Simulator</h1>
            <p className="section-subtitle">Simulate vehicle entry and exit at the parking gate</p>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          {/* Controls */}
          <div className="card" style={{ padding: 36 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              margin: '0 auto 28px', fontSize: '2.5rem',
              boxShadow: '0 12px 40px rgba(102,126,234,0.4)',
            }}>
              🚦
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Booking ID</label>
              <div style={{ position: 'relative' }}>
                <Gauge size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="gate-booking-id"
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="Enter Booking ID (e.g. 1)"
                  value={bookingId}
                  onChange={e => setBookingId(e.target.value)}
                  min={1}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                id="gate-entry-btn"
                className="btn btn-green btn-full"
                onClick={handleEntry}
                disabled={loading.entry}
                style={{ padding: '14px' }}
              >
                {loading.entry
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
                  : <><LogIn size={18} /> Simulate Entry (Open Gate)</>}
              </button>

              <button
                id="gate-exit-btn"
                className="btn btn-danger btn-full"
                onClick={handleExit}
                disabled={loading.exit}
                style={{ padding: '14px' }}
              >
                {loading.exit
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
                  : <><LogOut size={18} /> Simulate Exit (Close Gate)</>}
              </button>

              <button
                id="gate-search-btn"
                className="btn btn-ghost btn-full"
                onClick={handleSearch}
                disabled={loading.search}
              >
                <Search size={16} />
                Fetch History
              </button>
            </div>

            <div className="alert alert-info" style={{ marginTop: 24 }}>
              <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
              <div style={{ fontSize: '0.82rem' }}>
                <strong>How it works:</strong><br />
                1. Enter booking ID → Click "Entry" → Slot becomes OCCUPIED<br />
                2. Click "Exit" → Fee calculated at ₹30/hr → Slot becomes AVAILABLE
              </div>
            </div>
          </div>

          {/* Result */}
          <div>
            {history ? (
              <div className="card fade-in-up">
                <h3 style={{ fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🅿️ Parking Record
                </h3>
                {[
                  ['Booking ID',   `#${history.booking?.id ?? '—'}`],
                  ['Vehicle',      history.vehicleNumber],
                  ['Entry Time',   fmt(history.entryTime)],
                  ['Exit Time',    fmt(history.exitTime)],
                  ['Duration',     history.durationMinutes != null ? `${history.durationMinutes} min` : 'Still parked'],
                  ['Fee Charged',  history.fee != null ? `₹ ${history.fee}` : 'Pending exit'],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{k}</span>
                    <span style={{ fontWeight: 700, color: k === 'Fee Charged' && history.fee ? 'var(--accent-green)' : 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}

                {history.fee != null && (
                  <div className="alert alert-success" style={{ marginTop: 20 }}>
                    ✅ Vehicle has exited. Fee ₹{history.fee} should be collected.
                  </div>
                )}
                {history.exitTime == null && history.entryTime && (
                  <div className="alert alert-warning" style={{ marginTop: 20 }}>
                    🚗 Vehicle is currently inside the parking lot.
                  </div>
                )}
              </div>
            ) : (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon">🚦</div>
                  <div className="empty-state-title">No record loaded</div>
                  <div className="empty-state-desc">Enter a booking ID and click Entry, Exit, or Fetch History</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
