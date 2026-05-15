import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Activity } from 'lucide-react';
import api from '../api/axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username:email, password });
      
      const { token, role } = response.data; 
      
      if (role !== 'ADMIN' && role !== 'ROLE_ADMIN') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      localStorage.setItem('adminToken', token); 
      localStorage.setItem('adminRole', role);
      localStorage.setItem('adminUsername', email);
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Left Panel – Form */}
      <div style={styles.leftPanel}>
        <div style={styles.formWrap}>
          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <Activity size={18} color="#00C9A7" strokeWidth={2} />
            </div>
            <span style={styles.brandName}>Ratnadeep HMS</span>
          </div>

          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subheading}>Sign in to access the admin portal</p>

          {/* Restricted badge */}
          <div style={styles.restrictedBadge}>
            <Lock size={11} color="#B45309" />
            <span>Restricted — Authorized Personnel Only</span>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={{ fontSize: 13 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <div style={styles.field}>
              <label style={styles.label}>Admin Email</label>
              <div style={styles.inputWrap}>
                <Mail size={15} color="#9AA5B4" style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.target.style, styles.inputBlur)}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <Lock size={15} color="#9AA5B4" style={styles.inputIcon} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...styles.input, paddingRight: 40 }}
                  onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.target.style, styles.inputBlur)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                >
                  {showPass ? <EyeOff size={15} color="#9AA5B4" /> : <Eye size={15} color="#9AA5B4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <span style={styles.spinnerWrap}>
                  <span style={styles.spinner} />
                  Signing in...
                </span>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>

          <p style={styles.footer}>
            © 2026 Ratnadeep Multi-Speciality Hospital
          </p>
        </div>
      </div>

      {/* Right Panel – Visual */}
      <div style={styles.rightPanel}>
        <div style={styles.gridOverlay} />
        <div style={styles.glowBlob1} />
        <div style={styles.glowBlob2} />

        <div style={styles.previewCard}>
          <div style={styles.liveHeader}>
            <span style={styles.liveDot} />
            <span style={styles.liveText}>Live Hospital Stats</span>
          </div>
          <div style={styles.statsRow}>
            {[
              { label: 'Patients', value: '1,240', accent: true },
              { label: 'Doctors', value: '32', accent: false },
              { label: 'Appts', value: '18', accent: false },
            ].map((s) => (
              <div key={s.label} style={styles.miniStat}>
                <div style={styles.miniLabel}>{s.label}</div>
                <div style={{ ...styles.miniVal, color: s.accent ? '#00C9A7' : '#fff' }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={styles.revenueLine}>
            <span style={styles.revenueLabel}>Today's Revenue</span>
            <span style={styles.revenueVal}>₹45,200</span>
          </div>
        </div>

        <p style={styles.tagline}>
          Ratnadeep Multi-Speciality Hospital<br />
          Hospital Management System v2.0
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}

const F = "'DM Sans', -apple-system, sans-serif";

const styles = {
  root: {
    display: 'flex', minHeight: '100vh', fontFamily: F,
  },
  // LEFT
  leftPanel: {
    flex: '0 0 420px', background: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '56px 48px',
  },
  formWrap: { width: '100%', maxWidth: 340 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 },
  brandIcon: {
    width: 36, height: 36, background: '#0B1628',
    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: { fontSize: 18, fontWeight: 600, color: '#0B1628', letterSpacing: '-0.4px' },
  heading: { fontSize: 26, fontWeight: 600, color: '#0B1628', letterSpacing: '-0.5px', marginBottom: 6 },
  subheading: { fontSize: 14, color: '#4A5568', marginBottom: 24 },
  restrictedBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: '#FFF3DC', color: '#B45309',
    fontSize: 12, fontWeight: 500,
    padding: '5px 12px', borderRadius: 100,
    marginBottom: 28, border: '1px solid rgba(180,83,9,0.15)',
  },
  errorBox: {
    background: '#FDEDEB', border: '1px solid rgba(231,76,60,0.2)',
    borderRadius: 10, padding: '10px 14px',
    color: '#C0392B', marginBottom: 16,
  },
  field: { marginBottom: 18 },
  label: {
    display: 'block', fontSize: 11.5, fontWeight: 500,
    color: '#4A5568', marginBottom: 6,
    letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  input: {
    width: '100%', height: 44, paddingLeft: 38, paddingRight: 14,
    border: '1.5px solid rgba(11,22,40,0.15)', borderRadius: 10,
    fontFamily: F, fontSize: 14, color: '#0B1628',
    background: '#fff', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  inputFocus: { borderColor: '#00C9A7', boxShadow: '0 0 0 3px rgba(0,201,167,0.12)' },
  inputBlur: { borderColor: 'rgba(11,22,40,0.15)', boxShadow: 'none' },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    display: 'flex', alignItems: 'center',
  },
  submitBtn: {
    width: '100%', height: 46, marginTop: 6,
    background: '#0B1628', color: '#fff',
    border: 'none', borderRadius: 10,
    fontFamily: F, fontSize: 14, fontWeight: 500,
    cursor: 'pointer', transition: 'background 0.15s, transform 0.1s',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinnerWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  spinner: {
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
  footer: { marginTop: 32, fontSize: 12, color: '#9AA5B4', textAlign: 'center' },

  // RIGHT
  rightPanel: {
    flex: 1, background: '#0B1628',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: 40,
  },
  gridOverlay: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
  glowBlob1: {
    position: 'absolute', top: '20%', right: '15%',
    width: 300, height: 200,
    background: 'radial-gradient(ellipse, rgba(0,201,167,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBlob2: {
    position: 'absolute', bottom: '20%', left: '10%',
    width: 200, height: 180,
    background: 'radial-gradient(ellipse, rgba(245,166,35,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  previewCard: {
    position: 'relative', zIndex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: 28, width: 300,
    backdropFilter: 'blur(10px)',
    marginBottom: 24,
  },
  liveHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 },
  liveDot: {
    display: 'inline-block', width: 7, height: 7,
    background: '#00C9A7', borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  liveText: { fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statsRow: { display: 'flex', gap: 10, marginBottom: 16 },
  miniStat: {
    flex: 1, background: 'rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '12px 10px',
  },
  miniLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 },
  miniVal: { fontSize: 20, fontWeight: 600 },
  revenueLine: {
    paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  revenueLabel: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  revenueVal: { fontSize: 17, fontWeight: 600, color: '#00C9A7' },
  tagline: {
    position: 'relative', zIndex: 1,
    fontSize: 13, color: 'rgba(255,255,255,0.3)',
    textAlign: 'center', lineHeight: 1.7,
  },
};