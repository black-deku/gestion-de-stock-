import { Link } from 'react-router-dom';

/**
 * 404 Not Found page.
 */
function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#666' }}>Page not found</p>
      <Link to="/" style={{ color: '#3b82f6', marginTop: '1rem', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
