import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of your event management system.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon verified">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.verifiedUsers || 0}</h3>
            <p>Verified Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.unverifiedUsers || 0}</h3>
            <p>Pending Verification</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon events">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{stats?.stats.activeEvents || 0}</h3>
            <p>Active Events</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Events</h2>
            <Link to="/admin/events" className="view-all">View All →</Link>
          </div>
          <div className="card-content">
            {stats?.upcomingEvents?.length === 0 ? (
              <p className="empty-text">No upcoming events</p>
            ) : (
              <ul className="event-list">
                {stats?.upcomingEvents?.map(event => (
                  <li key={event._id}>
                    <div className="event-info">
                      <strong>{event.title}</strong>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <span className="badge badge-info">
                      {event.registeredUsers?.length || 0} registered
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Registrations</h2>
            <Link to="/admin/users" className="view-all">View All →</Link>
          </div>
          <div className="card-content">
            {stats?.recentUsers?.length === 0 ? (
              <p className="empty-text">No recent registrations</p>
            ) : (
              <ul className="user-list">
                {stats?.recentUsers?.map(user => (
                  <li key={user._id}>
                    <div className="user-info">
                      <strong>{user.name}</strong>
                      <span>{user.registrationNumber}</span>
                    </div>
                    <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Events by Category</h2>
          </div>
          <div className="card-content">
            {stats?.eventsByCategory?.length === 0 ? (
              <p className="empty-text">No events yet</p>
            ) : (
              <ul className="category-list">
                {stats?.eventsByCategory?.map(cat => (
                  <li key={cat._id}>
                    <span className="category-name">{cat._id || 'Other'}</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ 
                          width: `${(cat.count / stats?.stats.totalEvents) * 100}%`,
                          backgroundColor: getCategoryColor(cat._id)
                        }}
                      ></div>
                    </div>
                    <span className="category-count">{cat.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    technical: '#3182ce',
    cultural: '#d53f8c',
    sports: '#38a169',
    academic: '#805ad5',
    workshop: '#dd6b20',
    seminar: '#319795',
    other: '#718096'
  };
  return colors[category] || colors.other;
};

export default AdminDashboard;
