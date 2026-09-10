import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [mode,    setMode]    = useState('login');
  const [form,    setForm]    = useState({ username: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
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
        <h1 className="brand">FitTrack</h1>
        <p className="brand-sub">Track lifts. Hit PRs. Stay accountable.</p>

        <div className="tab-row">
          <button className={mode === 'login'    ? 'tab active' : 'tab'} onClick={() => setMode('login')}>Log In</button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <input
              className="input"
              placeholder="Username"
              value={form.username}
              onChange={set('username')}
              required
            />
          )}
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={set('email')}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={set('password')}
            required
          />
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Loading…' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
