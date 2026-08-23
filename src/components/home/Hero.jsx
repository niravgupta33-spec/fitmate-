// Hero Section Component
import { Link } from 'react-router-dom';
import { FiZap, FiTarget, FiTrendingUp, FiHeart } from 'react-icons/fi';
import './Home.css';

const Hero = () => {
  return (
    <section className="hero section" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">★ #1 Fitness Platform</div>
            <h1 id="hero-heading" className="hero-title">
              Train Smarter.<br />
              <span className="text-gradient">Live Stronger.</span>
            </h1>
            <p className="hero-subtitle">
              Track workouts, calculate macros, plan nutrition, and monitor your progress — 
              all in one beautifully designed platform built for results.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/workouts" className="btn btn-secondary btn-lg">Explore Workouts</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-stat-card">
                <div className="stat-icon"><FiZap /></div>
                <div className="stat-value">500+</div>
                <div className="stat-label">Exercises</div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-icon"><FiTarget /></div>
                <div className="stat-value">3</div>
                <div className="stat-label">Calculators</div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-icon"><FiTrendingUp /></div>
                <div className="stat-value">∞</div>
                <div className="stat-label">Tracking</div>
              </div>
              <div className="hero-stat-card">
                <div className="stat-icon"><FiHeart /></div>
                <div className="stat-value">100%</div>
                <div className="stat-label">Free</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
