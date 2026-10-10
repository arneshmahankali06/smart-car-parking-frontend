import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Download, ArrowLeft, CreditCard } from 'lucide-react';

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const booking   = location.state?.booking;

  if (!booking) {
    navigate('/bookings');
    return null;
  }

  const fmt = (dt) => new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="page-wrapper">
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 580 }}>
          {/* Success Banner */}
          <div style={{
            textAlign: 'center', padding: '40px 24px', marginBottom: 28,
            background: 'radial-gradient(ellipse at center, rgba(72,187,120,0.12) 0%, transparent 70%)',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 16px 48px rgba(56,239,125,0.35)',
            }}>
              <CheckCircle size={40} color="#fff" />
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
              Booking Confirmed!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your slot has been reserved. Show the QR code at entry.
            </p>
          </div>

          {/* QR + Details Card */}
          <div className="card" style={{ padding: 36 }}>
            {/* QR Code */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '28px', background: 'white', borderRadius: 16, marginBottom: 28,
            }}>
              <QRCodeSVG
                value={booking.qrCode || `BOOKING-${booking.id}`}
                size={180}
                level="H"
              />
              <div style={{ color: '#111', fontWeight: 700, marginTop: 14, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                Booking #{booking.id}
              </div>
            </div>

            {/* Details */}
            {[
              { label: 'Slot Number',   value: `${booking.slotNumber} (Floor ${booking.floor})` },
              { label: 'Vehicle',       value: booking.vehicleNumber },
              { label: 'Driver',        value: booking.userName },
              { label: 'Start Time',    value: fmt(booking.startTime) },
              { label: 'End Time',      value: fmt(booking.endTime) },
              { label: 'Status',        value: <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span> },
              { label: 'Booking ID',    value: `#${booking.id}` },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{row.label}</span>
                <span style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link
                to="/payment"
                state={{ booking }}
                className="btn btn-green btn-full"
                id="go-to-payment-btn"
              >
                <CreditCard size={16} />
                Pay Now
              </Link>
              <Link to="/bookings" className="btn btn-ghost" style={{ flex: 1 }} id="view-bookings-btn">
                <ArrowLeft size={16} />
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
