import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { IconLogo } from '../components/Icons';

export default function Home() {
  const [mode,    setMode]    = useState('login');
  const [form,    setForm]    = useState({ username: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = mode === 'login'
        ? await api.login({ email: form.email, password: form.password })
        : await api.register({ username: form.username, email: form.email, password: form.password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo-wrap"><IconLogo /></div>
          <h1>FitTrack</h1>
          <p>Track lifts. Hit PRs. Stay accountable.</p>
        </div>

        <div className="auth-glass">
          <div className="tab-row">
            <button className={mode === 'login'    ? 'tab active' : 'tab'} onClick={() => setMode('login')}>Log In</button>
            <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')}>Sign Up</button>
          </div>

          <form onSubmit={submit} className="form-stack">
            {mode === 'register' && (
              <div className="field">
                <label className="label">Username</label>
                <input className="input" placeholder="yourname" value={form.username} onChange={set('username')} required />
              </div>
            )}
            <div className="field">
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{marginTop:'4px'}}>
              {loading ? 'Loading…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
