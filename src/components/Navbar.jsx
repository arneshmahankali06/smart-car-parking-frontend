import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ParkingSquare, CalendarCheck, CreditCard,
  Settings, LogOut, Car, Activity, FileText, Gauge
} from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const driverLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/slots',     label: 'Slots',     icon: <ParkingSquare size={16} /> },
    { to: '/bookings',  label: 'Bookings',  icon: <CalendarCheck size={16} /> },
    { to: '/payment',   label: 'Payments',  icon: <CreditCard size={16} /> },
  ];

  const adminLinks = [
    { to: '/admin',          label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/admin/slots',    label: 'Slots',     icon: <ParkingSquare size={16} /> },
    { to: '/admin/bookings', label: 'Bookings',  icon: <CalendarCheck size={16} /> },
    { to: '/admin/reports',  label: 'Reports',   icon: <FileText size={16} /> },
    { to: '/gate',           label: 'Gate',      icon: <Gauge size={16} /> },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : driverLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="navbar-brand">
          <div className="brand-icon">🅿️</div>
          <span>SmartPark</span>
        </NavLink>

        <div className="navbar-links">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-user">
          {user?.role === 'ADMIN' && (
            <span className="badge badge-admin">Admin</span>
          )}
          <div className="nav-avatar" title={user?.email}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 120 }}
                className="truncate">
            {user?.name}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="logout-btn">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
