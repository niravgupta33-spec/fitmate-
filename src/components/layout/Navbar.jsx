// Navbar Component (Lectures 43-48: Navigation layout)
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import './Layout.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/workouts', label: 'Workouts' },
    { path: '/calculators', label: 'Calculators' },
    { path: '/nutrition', label: 'Nutrition' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="Fitmate Home">
            Fit<span>mate</span>
          </Link>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            {/* Mobile-only auth links */}
            {menuOpen && !isAuthenticated && (
              <>
                <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Log In</NavLink>
                <NavLink to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
              </>
            )}
          </div>

          <div className="navbar-actions">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar-user">
                  <div className="navbar-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={logout} aria-label="Log out">
                  <FiLogOut />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
