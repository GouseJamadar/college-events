import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiHome } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, config, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FiCalendar className="brand-icon" />
          <span>{config.collegeName}</span>
        </Link>

        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {user ? (
            <>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>
                    <FiHome /> Dashboard
                  </Link>
                  <Link to="/admin/events" className="nav-link" onClick={() => setIsOpen(false)}>
                    <FiCalendar /> Manage Events
                  </Link>
                  <Link to="/admin/users" className="nav-link" onClick={() => setIsOpen(false)}>
                    <FiUser /> Users
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/events" className="nav-link" onClick={() => setIsOpen(false)}>
                    <FiCalendar /> Events
                  </Link>
                  <Link to="/my-events" className="nav-link" onClick={() => setIsOpen(false)}>
                    <FiUser /> My Events
                  </Link>
                </>
              )}
              <div className="nav-user">
                <span className="user-name">{user.name || user.registrationNumber}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
