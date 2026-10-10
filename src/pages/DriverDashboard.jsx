import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllSlots } from '../api/slotApi';
import { getMyBookings } from '../api/bookingApi';
import { ParkingSquare, CalendarCheck, Car, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [slots,    setSlots]    = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getAllSlots(), getMyBookings()])
      .then(([s, b]) => { setSlots(s); setBookings(b); })
      .finally(() => setLoading(false));
  }, []);

  const available = slots.filter(s => s.status === 'AVAILABLE').length;
  const occupied  = slots.filter(s => s.status === 'OCCUPIED').length;
  const reserved  = slots.filter(s => s.status === 'RESERVED').length;
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;

  const statCards = [
    { label: 'Available Slots', value: available, icon: '🟢', grad: 'var(--grad-green)' },
    { label: 'Occupied Slots',  value: occupied,  icon: '🔴', grad: 'var(--grad-fire)' },
    { label: 'Reserved Slots',  value: reserved,  icon: '🟡', grad: 'var(--grad-gold)' },
    { label: 'My Active Bookings', value: confirmed, icon: '📋', grad: 'var(--grad-blue)' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-content">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="section-subtitle">Here's your parking overview for today</p>
          </div>
          <Link to="/book" className="btn btn-cyan" id="dashboard-book-btn">
            <Plus size={16} />
            Book a Slot
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="grid-4" style={{ marginBottom: 36 }}>
              {statCards.map(s => (
                <div key={s.label} className="stat-card fade-in-up">
                  <div className="stat-icon" style={{ background: s.grad }}>
                    <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid-2" style={{ marginBottom: 36 }}>
              <Link to="/slots" className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none' }}>
                <div className="stat-icon" style={{ background: 'var(--grad-cyan)', width: 64, height: 64, fontSize: '1.8rem' }}>🅿️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>View Slot Map</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>See real-time availability of all parking slots</div>
                </div>
                <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
              </Link>

              <Link to="/bookings" className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, textDecoration: 'none' }}>
                <div className="stat-icon" style={{ background: 'var(--grad-blue)', width: 64, height: 64, fontSize: '1.8rem' }}>📅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>My Bookings</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>View your booking history and QR codes</div>
                </div>
                <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
              </Link>
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <div className="section-header" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Bookings</h2>
                <Link to="/bookings" style={{ color: 'var(--accent-blue)', fontSize: '0.875rem', fontWeight: 600 }}>
                  View all →
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🅿️</div>
                  <div className="empty-state-title">No bookings yet</div>
                  <div className="empty-state-desc">Book your first parking slot to get started!</div>
                  <Link to="/book" className="btn btn-primary" style={{ marginTop: 20 }}>Book Now</Link>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Slot</th>
                        <th>Vehicle</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id}>
                          <td><strong>{b.slotNumber}</strong> (Floor {b.floor})</td>
                          <td>{b.vehicleNumber}</td>
                          <td>{new Date(b.startTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                          <td>{new Date(b.endTime).toLocaleString('en-IN',   { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                          <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
