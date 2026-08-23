// Features Section Component
import { FiActivity, FiPieChart, FiBookOpen, FiBarChart2, FiShield, FiSmartphone } from 'react-icons/fi';
import './Home.css';

const features = [
  { icon: <FiActivity />, color: 'emerald', title: 'Workout Library', desc: 'Browse 500+ exercises with detailed info, search, filter, and bookmark your favorites.' },
  { icon: <FiPieChart />, color: 'neon', title: 'Smart Calculators', desc: 'BMI, TDEE, and macro calculators to set data-driven fitness goals.' },
  { icon: <FiBookOpen />, color: 'jade', title: 'Nutrition Tracker', desc: 'Log meals, track calories and macros, and stay on top of your daily nutrition.' },
  { icon: <FiBarChart2 />, color: 'forest', title: 'Progress Dashboard', desc: 'Visual charts and stats to monitor your fitness journey over time.' },
  { icon: <FiShield />, color: 'mint', title: 'Secure & Private', desc: 'All your data stays on your device. No accounts required to get started.' },
  { icon: <FiSmartphone />, color: 'cyber', title: 'Fully Responsive', desc: 'Beautiful experience on desktop, tablet, and mobile. Train anywhere.' },
];

const Features = () => {
  return (
    <section className="features-section section" aria-labelledby="features-heading">
      <div className="container">
        <h2 id="features-heading" className="section-title" style={{ textAlign: 'center' }}>
          Everything You Need to <span className="text-accent">Crush Your Goals</span>
        </h2>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-2xl)' }}>
          Powerful tools designed to make your fitness journey effective, enjoyable, and measurable.
        </p>
        <div className="features-grid">
          {features.map((f, i) => (
            <article key={i} className={`feature-card animate-fade-in-up delay-${i + 1}`}>
              <div className={`feature-icon ${f.color}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
