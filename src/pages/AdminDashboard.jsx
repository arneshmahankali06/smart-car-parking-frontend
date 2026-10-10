import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../api/adminApi';
import { RefreshCw, ParkingSquare, Users, TrendingUp, CalendarCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAdminStats().then(setStats).finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading || !stats) return <div className="loading-center" style={{ minHeight: '80vh' }}><div className="spinner" /></div>;

  const cards = [
    { label: 'Total Slots',     value: stats.totalSlots,     icon: '🅿️', grad: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { label: 'Available',       value: stats.availableSlots, icon: '🟢', grad: 'var(--grad-green)' },
    { label: 'Occupied',        value: stats.occupiedSlots,  icon: '🔴', grad: 'var(--grad-fire)' },
    { label: 'Reserved',        value: stats.reservedSlots,  icon: '🟡', grad: 'var(--grad-gold)' },
    { label: 'Total Bookings',  value: stats.totalBookings,  icon: '📋', grad: 'var(--grad-blue)' },
    { label: 'Today Bookings',  value: stats.todayBookings,  icon: '📅', grad: 'var(--grad-cyan)' },
    { label: 'Total Revenue',   value: `₹${stats.totalRevenue}`, icon: '💰', grad: 'linear-gradient(135deg,#f7971e,#ffd200)' },
    { label: 'Today Revenue',   value: `₹${stats.todayRevenue}`, icon: '💵', grad: 'var(--grad-green)' },
  ];

  const quickLinks = [
    { to: '/admin/slots',    label: 'Manage Slots',    icon: '🅿️', desc: 'Add, edit, delete parking slots' },
    { to: '/admin/bookings', label: 'All Bookings',    icon: '📋', desc: 'View and manage all bookings' },
    { to: '/admin/reports',  label: 'Reports',         icon: '📊', desc: 'Parking history and revenue reports' },
    { to: '/gate',           label: 'Gate Simulator',  icon: '🚦', desc: 'Simulate vehicle entry and exit' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="section-header">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="section-subtitle">Real-time overview of your parking facility</p>
          </div>
          <button id="admin-refresh-btn" className="btn btn-ghost" onClick={load}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid-4" style={{ marginBottom: 36 }}>
          {cards.map(c => (
            <div key={c.label} className="stat-card fade-in-up">
              <div className="stat-icon" style={{ background: c.grad, fontSize: '1.4rem' }}>
                {c.icon}
              </div>
              <div className="stat-info">
                <div className="stat-value" style={{ fontSize: '1.6rem' }}>{c.value}</div>
                <div className="stat-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
        <div className="grid-4">
          {quickLinks.map(q => (
            <Link key={q.to} to={q.to} className="card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '2rem' }}>{q.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{q.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{q.desc}</div>
            </Link>
          ))}
        </div>

        {/* Total Users */}
        <div className="card" style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="stat-icon" style={{ background: 'var(--grad-blue)', fontSize: '1.4rem' }}>👥</div>
          <div>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{stats.totalUsers}</div>
            <div className="stat-label">Registered Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}
