// Home Page (Lectures 43-48: Multi-page SPA)
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-enter">
      <Hero />
      <Features />
      <Stats />
      <Testimonials />

      {/* CTA Section */}
      <section className="section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-box">
            <h2 id="cta-heading">Ready to Start Your <span className="text-gradient">Fitness Journey</span>?</h2>
            <p>Join thousands of users who are already training smarter with Fitmate.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
