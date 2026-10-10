import { Link } from 'react-router-dom';
import { Car, Shield, Zap, BarChart3, QrCode, Wifi } from 'lucide-react';

const features = [
  { icon: <Zap size={28} />, title: 'Real-Time Availability', desc: 'See live slot occupancy with instant updates. No more circling the lot.' },
  { icon: <QrCode size={28} />, title: 'QR Code Booking', desc: 'Book a slot and get a QR code for seamless entry and exit.' },
  { icon: <Shield size={28} />, title: 'Secure Payments', desc: 'Pay via UPI, Card, or Wallet with fully encrypted transactions.' },
  { icon: <Car size={28} />, title: 'Smart Gate Control', desc: 'Sensors automatically open gates on vehicle detection.' },
  { icon: <BarChart3 size={28} />, title: 'Admin Reports', desc: 'Full analytics on bookings, revenue, and slot utilization.' },
  { icon: <Wifi size={28} />, title: 'Sensor Integration', desc: 'IoT-ready system for real-time slot monitoring.' },
];

const stats = [
  { value: '500+', label: 'Parking Slots' },
  { value: '10K+', label: 'Happy Drivers' },
  { value: '99.9%', label: 'Uptime' },
  { value: '₹30/hr', label: 'Starting Rate' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 48px', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.3rem' }}>
            <div className="brand-icon">🅿️</div>
            SmartPark
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login"    className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>

        {/* Hero Content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: '80px 24px',
          position: 'relative',
        }}>
          {/* Glow orbs */}
          <div style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%)',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />

          <div className="badge badge-confirmed" style={{ marginBottom: 24, fontSize: '0.8rem' }}>
            🚀 Smart Car Parking Management System
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 800,
          }}>
            Park Smarter,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #63b3ed, #00d4ff, #b794f4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Not Harder
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            marginBottom: 48,
            lineHeight: 1.7,
          }}>
            Book parking slots in seconds, pay online, and enter with a QR code.
            Real-time availability, automated gate control, and zero manual intervention.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-cyan btn-lg" id="hero-register-btn">
              <Car size={20} />
              Book a Slot Now
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg" id="hero-login-btn">
              Sign In →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: '48px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #63b3ed, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="section-title" style={{ fontSize: '2.2rem', WebkitTextFillColor: 'unset', color: 'var(--text-primary)' }}>
            Everything you need to park effortlessly
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '1rem' }}>
            Built with Java Spring Boot, React, and MySQL for a production-ready experience
          </p>
        </div>

        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `hsl(${i * 40 + 200}, 80%, 40%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, color: '#fff',
                boxShadow: `0 8px 24px hsla(${i * 40 + 200}, 80%, 40%, 0.3)`,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div style={{ padding: '80px 48px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
          Ready to park smarter?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1rem' }}>
          Create your free account and book your first slot in under 2 minutes.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg" id="cta-register-btn">
          Create Free Account →
        </Link>
      </div>
    </div>
  );
}
