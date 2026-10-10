import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/authApi';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      loginUser(data);
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 20px',
            boxShadow: '0 12px 40px rgba(102,126,234,0.4)',
          }}>🅿️</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to your SmartPark account
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 36 }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="driver@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: 8, padding: '14px' }}
              disabled={loading}
            >
              {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</> : <><LogIn size={17} /> Sign In</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
              Register here
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div className="alert alert-info" style={{ marginTop: 20, fontSize: '0.8rem', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
            <strong>Demo Admin:</strong>
            <span>First register with any email, then manually set role=ADMIN in MySQL.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
