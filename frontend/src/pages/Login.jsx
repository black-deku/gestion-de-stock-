import { Link } from 'react-router-dom';

/**
 * Login page placeholder.
 * Will be replaced with actual login form in the auth step.
 */
function Login() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔐 Login</h1>
      <p>Authentication form will be implemented in the next step.</p>
      <Link to="/" style={{ color: '#3b82f6', marginTop: '1rem', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default Login;
