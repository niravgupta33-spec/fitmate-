// 404 Not Found Page (Lectures 37-42: 404 pages)
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="auth-page page-enter" style={{ textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: 'var(--fs-5xl)', fontWeight: 900, marginBottom: 'var(--space-md)' }}>
          <span className="text-gradient">404</span>
        </h1>
        <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--space-md)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)', maxWidth: 400 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg"><FiHome /> Back to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
