import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiCalendar, FiX, FiDownload } from 'react-icons/fi';
import './Admin.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showRegistrations, setShowRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'other',
    maxParticipants: 100,
    isActive: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      setRegistrations(response.data.registrations);
      setShowRegistrations(eventId);
    } catch (error) {
      toast.error('Failed to load registrations');
    }
  };

  const downloadCSV = (eventTitle) => {
    if (registrations.length === 0) {
      toast.error('No registrations to download');
      return;
    }

    const headers = ['Name', 'Registration Number', 'Email', 'Status'];
    const rows = registrations.map(user => [
      user.name,
      user.registrationNumber,
      user.email,
      user.isVerified ? 'Verified' : 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV downloaded!');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.split('T')[0],
        time: event.time,
        venue: event.venue,
        category: event.category,
        maxParticipants: event.maxParticipants,
        isActive: event.isActive
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: 'other',
        maxParticipants: 100,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, formData);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', formData);
        toast.success('Event created successfully');
      }
      closeModal();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
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
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Events</h1>
          <p>Create and manage college events</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Event
        </button>
      </div>

      <div className="events-admin-grid">
        {events.length === 0 ? (
          <div className="empty-state">
            <FiCalendar className="empty-icon" />
            <h2>No Events Yet</h2>
            <p>Create your first event to get started</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FiPlus /> Create Event
            </button>
          </div>
        ) : (
          events.map(event => (
            <div key={event._id} className={`event-admin-card ${!event.isActive ? 'inactive' : ''}`}>
              <div className="event-admin-header">
                <span className={`category-tag ${event.category}`}>{event.category}</span>
                {!event.isActive && <span className="inactive-badge">Inactive</span>}
              </div>
              <h3>{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-meta">
                <span><FiCalendar /> {formatDate(event.date)}</span>
                <span>{event.time}</span>
                <span>{event.venue}</span>
              </div>
              <div className="event-stats">
                <span className="registrations" onClick={() => fetchRegistrations(event._id)}>
                  <FiUsers /> {event.registeredUsers?.length || 0} / {event.maxParticipants}
                </span>
              </div>
              <div className="event-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openModal(event)}>
                  <FiEdit2 /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Event Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="technical">Technical</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="academic">Academic</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Venue</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Participants</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span>Event is active</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRegistrations && (
        <div className="modal-overlay" onClick={() => setShowRegistrations(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Event Registrations</h2>
              <div className="modal-header-actions">
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => downloadCSV(events.find(e => e._id === showRegistrations)?.title || 'event')}
                >
                  <FiDownload /> Download CSV
                </button>
                <button className="modal-close" onClick={() => setShowRegistrations(null)}>
                  <FiX />
                </button>
              </div>
            </div>
            <div className="registrations-list">
              {registrations.length === 0 ? (
                <p className="empty-text">No registrations yet</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Reg. Number</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.registrationNumber}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
