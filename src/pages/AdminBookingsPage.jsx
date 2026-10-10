import { useEffect, useState } from 'react';
import { getAllBookings, adminCancelBooking } from '../api/bookingApi';
import { RefreshCw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('ALL');

  const load = () => {
    setLoading(true);
    getAllBookings().then(setBookings).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await adminCancelBooking(id);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const statuses = ['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);
  const fmt = (dt) => new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">All Bookings</h1>
            <p className="section-subtitle">{bookings.length} total bookings</p>
          </div>
          <button id="admin-refresh-bookings-btn" className="btn btn-ghost" onClick={load}>
            <RefreshCw size={16} className={loading ? 'pulse' : ''} />
            Refresh
          </button>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          {statuses.map(s => (
            <button
              key={s}
              id={`filter-booking-${s.toLowerCase()}`}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(s)}
            >
              {s === 'ALL' ? `All (${bookings.length})` : `${s} (${bookings.filter(b => b.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No bookings found</div>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>User</th>
                    <th>Slot</th>
                    <th>Vehicle</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{b.id}</td>
                      <td>{b.userName}</td>
                      <td><strong>{b.slotNumber}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floor {b.floor}</span></td>
                      <td style={{ fontFamily: 'monospace' }}>{b.vehicleNumber}</td>
                      <td style={{ fontSize: '0.875rem' }}>{fmt(b.startTime)}</td>
                      <td style={{ fontSize: '0.875rem' }}>{fmt(b.endTime)}</td>
                      <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td>
                        {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                          <button
                            id={`admin-cancel-${b.id}`}
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancel(b.id)}
                            title="Cancel booking"
                          >
                            <XCircle size={14} />
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
