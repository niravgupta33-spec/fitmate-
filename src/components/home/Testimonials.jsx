// Testimonials Section
import { FiStar } from 'react-icons/fi';
import './Home.css';

const testimonials = [
  { name: 'Alex Rivera', role: 'Marathon Runner', initial: 'A', text: 'Fitmate completely changed my training approach. The workout library and macro calculator are incredibly intuitive and powerful.' },
  { name: 'Priya Sharma', role: 'Yoga Instructor', initial: 'P', text: 'I love the clean design and how easy it is to track nutrition. My students also use it to monitor their daily fitness goals.' },
  { name: 'Marcus Chen', role: 'Powerlifter', initial: 'M', text: 'The progress dashboard helps me visualize my gains over time. Best fitness tool I\'ve used — and it\'s completely free!' },
];

const Testimonials = () => {
  return (
    <section className="section features-section" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="section-title" style={{ textAlign: 'center' }}>
          Loved by <span className="text-accent">Fitness Enthusiasts</span>
        </h2>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-2xl)' }}>
          See what our community has to say about their Fitmate experience.
        </p>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <article key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, j) => <FiStar key={j} fill="var(--color-warning)" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initial}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
