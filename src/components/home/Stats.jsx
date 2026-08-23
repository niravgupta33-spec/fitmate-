// Stats Counter Section
import { useState, useEffect, useRef } from 'react';
import './Home.css';

const statsData = [
  { target: 500, suffix: '+', label: 'Exercises' },
  { target: 10, suffix: 'K+', label: 'Active Users' },
  { target: 3, suffix: '', label: 'Pro Calculators' },
  { target: 100, suffix: '%', label: 'Free Forever' },
];

const Stats = () => {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          statsData.forEach((stat, idx) => {
            let start = 0;
            const increment = Math.ceil(stat.target / 40);
            const timer = setInterval(() => {
              start += increment;
              if (start >= stat.target) {
                start = stat.target;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const updated = [...prev];
                updated[idx] = start;
                return updated;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="stats-bar">
          {statsData.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{counts[i]}{stat.suffix}</div>
              <div className="stat-text">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
