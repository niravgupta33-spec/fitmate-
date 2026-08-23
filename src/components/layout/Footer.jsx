// Footer Component (Lectures 1-6: Semantic HTML)
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="navbar-logo" style={{ fontSize: '1.5rem' }}>
              Fit<span>mate</span>
            </Link>
            <p>Your all-in-one fitness platform. Track workouts, plan nutrition, calculate goals, and crush your fitness journey.</p>
          </div>

          <div>
            <h4 className="footer-title">Platform</h4>
            <div className="footer-links">
              <Link to="/workouts">Workouts</Link>
              <Link to="/calculators">Calculators</Link>
              <Link to="/nutrition">Nutrition</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Tools</h4>
            <div className="footer-links">
              <Link to="/calculators">BMI Calculator</Link>
              <Link to="/calculators">TDEE Calculator</Link>
              <Link to="/calculators">Macro Calculator</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Account</h4>
            <div className="footer-links">
              <Link to="/login">Log In</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/profile">Profile</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fitmate. All rights reserved.</p>
          <div className="footer-socials" aria-label="Social media links">
            <a href="#" aria-label="GitHub"><FiGithub /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
