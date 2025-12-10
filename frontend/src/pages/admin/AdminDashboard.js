import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
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

  const COLORS = ['#667eea', '#764ba2', '#38a169', '#d53f8c', '#dd6b20', '#319795', '#718096'];

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

  const categoryData = stats?.eventsByCategory?.map(cat => ({
    name: cat._id || 'Other',
    value: cat.count,
    color: getCategoryColor(cat._id)
  })) || [];

  const registrationTrend = stats?.recentUsers?.map((user, index) => ({
    name: `User ${index + 1}`,
    date: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: index + 1
  })).reverse() || [];

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

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Events by Category</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Category Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat-card">
          <FiTrendingUp className="quick-stat-icon" />
          <div>
            <h4>Total Events</h4>
            <p>{stats?.stats.totalEvents || 0}</p>
          </div>
        </div>
        <div className="quick-stat-card">
          <FiUsers className="quick-stat-icon" />
          <div>
            <h4>Avg. Registrations</h4>
            <p>{stats?.stats.totalEvents ? Math.round((stats?.upcomingEvents?.reduce((sum, e) => sum + (e.registeredUsers?.length || 0), 0) || 0) / stats.stats.totalEvents) : 0} per event</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
