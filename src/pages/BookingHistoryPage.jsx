import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../api/bookingApi';
import { RefreshCw, XCircle, CreditCard, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [qrModal,  setQrModal]  = useState(null); // booking shown in modal

  const load = () => {
    setLoading(true);
    getMyBookings().then(setBookings).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const fmt = (dt) => new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">My Bookings</h1>
            <p className="section-subtitle">View your booking history and QR codes</p>
          </div>
          <button id="refresh-bookings-btn" className="btn btn-ghost" onClick={load} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'pulse' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No bookings yet</div>
            <div className="empty-state-desc">Your booking history will appear here</div>
            <Link to="/book" className="btn btn-primary" style={{ marginTop: 20 }}>Book a Slot</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Slot</th>
                    <th>Vehicle</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{b.id}</td>
                      <td><strong>{b.slotNumber}</strong><br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floor {b.floor}</span></td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{b.vehicleNumber}</td>
                      <td style={{ fontSize: '0.875rem' }}>{fmt(b.startTime)}</td>
                      <td style={{ fontSize: '0.875rem' }}>{fmt(b.endTime)}</td>
                      <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            id={`view-qr-${b.id}`}
                            className="btn btn-sm btn-ghost"
                            onClick={() => setQrModal(b)}
                            title="View QR Code"
                          >
                            <QrCode size={14} />
                          </button>
                          {b.status === 'CONFIRMED' && (
                            <>
                              <Link to="/payment" state={{ booking: b }} className="btn btn-sm btn-cyan" title="Pay">
                                <CreditCard size={14} />
                              </Link>
                              <button
                                id={`cancel-booking-${b.id}`}
                                className="btn btn-sm btn-danger"
                                onClick={() => handleCancel(b.id)}
                                title="Cancel"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {qrModal && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 200, backdropFilter: 'blur(8px)',
            }}
            onClick={() => setQrModal(null)}
          >
            <div
              className="card"
              style={{ padding: 36, textAlign: 'center', maxWidth: 360, width: '90%' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Booking #{qrModal.id}</h3>
              <div style={{ background: 'white', padding: 20, borderRadius: 12, display: 'inline-block', marginBottom: 16 }}>
                <QRCodeSVG value={qrModal.qrCode || `BOOKING-${qrModal.id}`} size={160} level="H" />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>
                Slot: <strong>{qrModal.slotNumber}</strong> | Vehicle: <strong>{qrModal.vehicleNumber}</strong>
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 20 }}>
                Show this QR code at the parking gate
              </p>
              <button className="btn btn-ghost btn-full" onClick={() => setQrModal(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
