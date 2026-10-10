import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvailableSlots } from '../api/slotApi';
import { createBooking } from '../api/bookingApi';
import { CalendarCheck, Car, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const preSlot   = location.state?.slot;

  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSub]  = useState(false);
  const [error,   setError]   = useState('');

  // Default: start 1hr from now, end 2hrs from now
  const now = new Date();
  const pad = (d) => d.toISOString().slice(0, 16);
  const [form, setForm] = useState({
    slotId:        preSlot?.id || '',
    vehicleNumber: '',
    startTime:     pad(new Date(now.getTime() + 60 * 60 * 1000)),
    endTime:       pad(new Date(now.getTime() + 2  * 60 * 60 * 1000)),
  });

  useEffect(() => {
    setLoading(true);
    getAvailableSlots()
      .then(setSlots)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const start = new Date(form.startTime);
    const end   = new Date(form.endTime);
    if (end <= start) {
      setError('End time must be after start time');
      return;
    }
    if (start <= new Date()) {
      setError('Start time must be in the future');
      return;
    }

    setSub(true);
    try {
      const booking = await createBooking({
        slotId:        Number(form.slotId),
        vehicleNumber: form.vehicleNumber.toUpperCase(),
        startTime:     form.startTime + ':00',
        endTime:       form.endTime   + ':00',
      });
      toast.success('Booking confirmed! 🎉');
      navigate('/confirmation', { state: { booking } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Slot may be taken.');
    } finally {
      setSub(false);
    }
  };

  const durationHrs = ((new Date(form.endTime) - new Date(form.startTime)) / 3600000).toFixed(1);
  const estimatedFee = Math.max(0, (durationHrs * 30)).toFixed(2);

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Book a Parking Slot</h1>
            <p className="section-subtitle">Choose a slot, set your time, and confirm</p>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          {/* Form */}
          <div className="card" style={{ padding: 36 }}>
            {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* Slot */}
              <div className="form-group">
                <label className="form-label">Parking Slot</label>
                {loading ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading available slots…</div>
                ) : (
                  <select
                    id="booking-slot-select"
                    className="form-input"
                    value={form.slotId}
                    onChange={e => setForm({ ...form, slotId: e.target.value })}
                    required
                  >
                    <option value="">Select a slot…</option>
                    {slots.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.slotNumber} — Floor {s.floor ?? 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Vehicle */}
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <div style={{ position: 'relative' }}>
                  <Car size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="booking-vehicle"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 42, textTransform: 'uppercase' }}
                    placeholder="e.g. TN01AB1234"
                    value={form.vehicleNumber}
                    onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Times */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    id="booking-start"
                    type="datetime-local"
                    className="form-input"
                    value={form.startTime}
                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    id="booking-end"
                    type="datetime-local"
                    className="form-input"
                    value={form.endTime}
                    onChange={e => setForm({ ...form, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                id="booking-submit-btn"
                type="submit"
                className="btn btn-primary btn-full"
                style={{ padding: '14px', marginTop: 4 }}
                disabled={submitting || !form.slotId}
              >
                {submitting ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Confirming…</> : <><CalendarCheck size={17} /> Confirm Booking</>}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} style={{ color: 'var(--accent-blue)' }} />
                Booking Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Slot',     value: form.slotId ? slots.find(s => s.id === Number(form.slotId))?.slotNumber ?? '—' : '—' },
                  { label: 'Vehicle',  value: form.vehicleNumber || '—' },
                  { label: 'Duration', value: form.startTime && form.endTime ? `${durationHrs} hrs` : '—' },
                  { label: 'Est. Fee', value: form.startTime && form.endTime ? `₹ ${estimatedFee}` : '—' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{row.label}</span>
                    <span style={{ fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="alert alert-info">
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <div>
                <strong>Rate: ₹30/hour</strong><br />
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Minimum billing: 1 minute. Payment collected on exit.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
