import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiUsers, FiAward, FiArrowRight } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const { config, user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to<br />
            <span className="gradient-text">{config.collegeName}</span>
          </h1>
          <p className="hero-subtitle">
            Discover, Register, and Participate in exciting college events. 
            Stay updated with all the happenings on campus!
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/events" className="btn btn-primary btn-lg">
                Browse Events <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-shape"></div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Use Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiCalendar />
            </div>
            <h3>Monthly Events</h3>
            <p>Browse events organized by month. Never miss an important event on campus.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiUsers />
            </div>
            <h3>Easy Registration</h3>
            <p>Register for events with just one click. Get instant confirmation via email.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiAward />
            </div>
            <h3>Track Participation</h3>
            <p>Keep track of all the events you've registered for in your dashboard.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Join the Fun?</h2>
          <p>Create your account and start exploring events today!</p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Account <FiArrowRight />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
