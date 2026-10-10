import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api/authApi';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form);
      loginUser(data);
      toast.success(`Welcome to SmartPark, ${data.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (id, label, type, icon, placeholder, key) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          className="form-input"
          style={{ paddingLeft: 42 }}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          required={key !== 'phone'}
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #0093E9, #80D0C7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 20px',
            boxShadow: '0 12px 40px rgba(0, 147, 233, 0.4)',
          }}>🅿️</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join SmartPark and start booking instantly
          </p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {field('reg-name',     'Full Name',     'text',     <User size={16} />,  'John Doe',           'name')}
            {field('reg-email',    'Email Address', 'email',    <Mail size={16} />,  'john@example.com',   'email')}
            {field('reg-password', 'Password',      'password', <Lock size={16} />,  'Min 6 characters',   'password')}
            {field('reg-phone',    'Phone (optional)', 'tel',   <Phone size={16} />, '+91 9876543210',     'phone')}

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-cyan btn-full"
              style={{ marginTop: 8, padding: '14px' }}
              disabled={loading}
            >
              {loading
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account...</>
                : <><UserPlus size={17} /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
