import { useEffect, useState } from 'react';
import { getAdminHistory, getAdminStats } from '../api/adminApi';
import { RefreshCw } from 'lucide-react';

export default function AdminReportsPage() {
  const [history, setHistory] = useState([]);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminHistory(), getAdminStats()])
      .then(([h, s]) => { setHistory(h); setStats(s); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Reports & History</h1>
            <p className="section-subtitle">Parking activity and revenue overview</p>
          </div>
          <button id="admin-refresh-reports-btn" className="btn btn-ghost" onClick={load}>
            <RefreshCw size={16} className={loading ? 'pulse' : ''} />
            Refresh
          </button>
        </div>

        {/* Revenue Cards */}
        {stats && (
          <div className="grid-4" style={{ marginBottom: 32 }}>
            {[
              { label: 'Total Revenue',  value: `₹${stats.totalRevenue}`, icon: '💰', grad: 'linear-gradient(135deg,#f7971e,#ffd200)' },
              { label: 'Today Revenue',  value: `₹${stats.todayRevenue}`,  icon: '💵', grad: 'var(--grad-green)' },
              { label: 'Total Bookings', value: stats.totalBookings,        icon: '📋', grad: 'var(--grad-blue)' },
              { label: 'Today Bookings', value: stats.todayBookings,        icon: '📅', grad: 'var(--grad-cyan)' },
            ].map(c => (
              <div key={c.label} className="stat-card fade-in-up">
                <div className="stat-icon" style={{ background: c.grad }}>{c.icon}</div>
                <div className="stat-info">
                  <div className="stat-value" style={{ fontSize: '1.6rem' }}>{c.value}</div>
                  <div className="stat-label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Parking History Table */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Parking History</h2>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🅿️</div>
              <div className="empty-state-title">No parking history yet</div>
              <div className="empty-state-desc">History appears after vehicles enter and exit</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Duration</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{h.id}</td>
                      <td>#{h.booking?.id || '—'}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{h.vehicleNumber}</td>
                      <td>{fmt(h.entryTime)}</td>
                      <td>{fmt(h.exitTime)}</td>
                      <td>{h.durationMinutes != null ? `${h.durationMinutes} min` : '—'}</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
                        {h.fee != null ? `₹${h.fee}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
