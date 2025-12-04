import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiCheck, FiMail, FiUser } from 'react-icons/fi';
import './Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/verify`);
      toast.success('User verified successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.registrationNumber.includes(search) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && user.isVerified;
    if (filter === 'unverified') return matchesSearch && !user.isVerified;
    return matchesSearch;
  });

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
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Users</h1>
        <p>View and manage registered students</p>
      </div>

      <div className="admin-toolbar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, reg number, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({users.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
            onClick={() => setFilter('verified')}
          >
            Verified ({users.filter(u => u.isVerified).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unverified' ? 'active' : ''}`}
            onClick={() => setFilter('unverified')}
          >
            Pending ({users.filter(u => !u.isVerified).length})
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Reg. Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Events</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">No users found</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        <FiUser />
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td><strong>{user.registrationNumber}</strong></td>
                  <td>
                    <a href={`mailto:${user.email}`} className="email-link">
                      <FiMail /> {user.email}
                    </a>
                  </td>
                  <td>
                    <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>{user.registeredEvents?.length || 0}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      {!user.isVerified && (
                        <button 
                          className="action-btn verify"
                          onClick={() => handleVerify(user._id)}
                          title="Verify User"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
