import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DriverDashboard    from './pages/DriverDashboard';
import SlotMapPage        from './pages/SlotMapPage';
import BookingPage        from './pages/BookingPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import PaymentPage        from './pages/PaymentPage';
import ConfirmationPage   from './pages/ConfirmationPage';
import AdminDashboard     from './pages/AdminDashboard';
import AdminSlotsPage     from './pages/AdminSlotsPage';
import AdminBookingsPage  from './pages/AdminBookingsPage';
import AdminReportsPage   from './pages/AdminReportsPage';
import GateSimulatorPage  from './pages/GateSimulatorPage';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-center" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  const showNavbar = !!user;

  return (
    <BrowserRouter>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Driver */}
        <Route path="/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />
        <Route path="/slots"     element={<ProtectedRoute><SlotMapPage /></ProtectedRoute>} />
        <Route path="/book"      element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/bookings"  element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
        <Route path="/payment"   element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"          element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/slots"    element={<ProtectedRoute allowedRole="ADMIN"><AdminSlotsPage /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRole="ADMIN"><AdminBookingsPage /></ProtectedRoute>} />
        <Route path="/admin/reports"  element={<ProtectedRoute allowedRole="ADMIN"><AdminReportsPage /></ProtectedRoute>} />
        <Route path="/gate"           element={<ProtectedRoute allowedRole="ADMIN"><GateSimulatorPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
