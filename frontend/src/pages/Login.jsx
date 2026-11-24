import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleMode() {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !username.trim()) { setError('Please enter a username.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await api.register(username.trim(), email.trim(), password, role);
      }
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <Link to="/" className="login-back" aria-label="Return to home">← Back to home</Link>

      <div className="login-card">
        <div className="login-card__header">
          <div className="login-logo">
            <svg className="login-logo-mark" viewBox="0 0 32 32" aria-hidden="true">
              <path d="m15.9999986 1c1.5233269 0 2.8853262.63480054 3.8953593 1.81519027.3882762.45341363.68547.92629092 1.0843684 1.66682671.2077895.38580736.3771705.71048333.7298554 1.39396099 2.3978208 4.64232753 4.6209922 9.18314333 6.7016244 13.68538313.3594669.7766385.527891 1.1447222.7200167 1.5790784.1995583.4508363.3280074.7623354.4419855 1.0821517.3997766 1.1232419.5159428 2.1707386.3600275 3.2582239-.3240931 2.2557302-1.8367 4.1856521-3.95096 5.0409981-1.0254641.4151758-2.1422465.5625301-3.2696353.4321454-1.0267657-.118929-2.024688-.4558168-3.0351712-1.0229726-1.275365-.7159866-2.5350312-1.7827288-3.9051464-3.3033582l.2266757.2483722-.0856973.0946079c-1.145637 1.2281003-2.2190841 2.1368979-3.2968208 2.7889023l-.294092.1714995c-1.0104269.5671868-2.0081759.904038-3.03521001 1.0229618-1.12673901.1303811-2.24398199-.0169897-3.26921311-.4319769-2.11483177-.8556897-3.62749027-2.7857059-3.95111189-5.0412542-.1561593-1.0874722-.03988101-2.1352549.36013074-3.2579563.11409432-.3205601.24289579-.6332632.441636-1.0823287.01870988-.0422708.03714338-.0838012.05551118-.1250574l.11110373-.2479763c.13263376-.2941687.28269418-.6205865.52244291-1.1391507 2.09685793-4.5370071 4.31810871-9.0773027 6.63389165-13.56082146.3456232-.67003797.5228704-1.01175086.6839133-1.31498818l.0958986-.17964411.0487735-.090707c.3992391-.74059748.6959289-1.21278252 1.0833854-1.66583756 1.0105713-1.18121403 2.3727886-1.81627269 3.8964581-1.81627269z" fill="currentColor" />
            </svg>
            <span className="login-logo-text">airbnb</span>
          </div>
          <h1 className="login-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="login-subtitle">{mode === 'login' ? 'Log in to your Airbnb account' : 'Join Airbnb to start booking or hosting'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="login-error" role="alert" aria-live="assertive">{error}</div>}

          {mode === 'signup' && (
            <div className="login-field">
              <label className="login-label" htmlFor="username">Username</label>
              <input id="username" type="text" className="login-input" placeholder="Enter a username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus required />
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="login-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus={mode === 'login'} required />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="login-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required />
          </div>

          {mode === 'login' && <a href="#forgot" className="login-forgot">Forgot password?</a>}

          {mode === 'signup' && (
            <div className="login-field">
              <label className="login-label" htmlFor="role">I want to</label>
              <div className="login-role-grid">
                <label className={`login-role-option${role === 'user' ? ' login-role-option--active' : ''}`}>
                  <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} className="sr-only" />
                  <span className="login-role-text">Book stays</span>
                </label>
                <label className={`login-role-option${role === 'host' ? ' login-role-option--active' : ''}`}>
                  <input type="radio" name="role" value="host" checked={role === 'host'} onChange={() => setRole('host')} className="sr-only" />
                  <span className="login-role-text">Host my place</span>
                </label>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-submit" disabled={loading} aria-busy={loading}>
            {loading ? (mode === 'login' ? 'Logging in…' : 'Creating account…') : (mode === 'login' ? 'Log in' : 'Sign up')}
          </button>
        </form>

        <div className="login-switch-site">
          <p>Are you a host?</p>
          <a href="/admin/login" className="login-host-link">Log in as a host</a>
        </div>

        <div className="login-divider" aria-hidden="true"><span>or</span></div>

        <p className="login-toggle">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="login-toggle-btn" onClick={toggleMode}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
