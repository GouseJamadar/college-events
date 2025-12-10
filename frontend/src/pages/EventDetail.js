import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowLeft, FiCheck, FiDownload } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to load event');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await api.post(`/events/${id}/register`);
      toast.success('Successfully registered for event!');
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    try {
      await api.post(`/events/${id}/unregister`);
      toast.success('Successfully unregistered from event');
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unregister');
    }
  };

  const isRegistered = event?.registeredUsers?.some(
    u => u._id === user?.id || u === user?.id
  );

  const isFull = event?.registeredUsers?.length >= event?.maxParticipants;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <button className="back-btn" onClick={() => navigate('/events')}>
        <FiArrowLeft /> Back to Events
      </button>

      <div className="event-detail-card">
        <div 
          className="event-detail-header"
          style={{ background: `linear-gradient(135deg, ${getCategoryColor(event.category)} 0%, ${getCategoryColor(event.category)}99 100%)` }}
        >
          <span className="category-badge">{event.category}</span>
          <h1>{event.title}</h1>
        </div>

        <div className="event-detail-body">
          <div className="event-info-grid">
            <div className="info-item">
              <FiCalendar className="info-icon" />
              <div>
                <span className="info-label">Date</span>
                <span className="info-value">{formatDate(event.date)}</span>
              </div>
            </div>
            <div className="info-item">
              <FiClock className="info-icon" />
              <div>
                <span className="info-label">Time</span>
                <span className="info-value">{event.time}</span>
              </div>
            </div>
            <div className="info-item">
              <FiMapPin className="info-icon" />
              <div>
                <span className="info-label">Venue</span>
                <span className="info-value">{event.venue}</span>
              </div>
            </div>
            <div className="info-item">
              <FiUsers className="info-icon" />
              <div>
                <span className="info-label">Participants</span>
                <span className="info-value">{event.registeredUsers?.length || 0} / {event.maxParticipants}</span>
              </div>
            </div>
          </div>

          <div className="event-description-section">
            <h2>About This Event</h2>
            <p>{event.description}</p>
          </div>

          <div className="registration-section">
            {isRegistered ? (
              <div className="registered-status">
                <div className="status-badge success">
                  <FiCheck /> You are registered for this event
                </div>
                <div className="qr-section">
                  <p>Show this QR code at the event:</p>
                  <div className="qr-code">
                    <QRCodeSVG 
                      value={`EVENT:${event._id}|USER:${user?.id}|NAME:${user?.name}|REG:${user?.registrationNumber}`}
                      size={150}
                      level="H"
                    />
                  </div>
                  <p className="qr-info">Registration #{user?.registrationNumber}</p>
                </div>
                <button className="btn btn-danger" onClick={handleUnregister}>
                  Cancel Registration
                </button>
              </div>
            ) : isFull ? (
              <div className="status-badge full">
                Event is Full - No more registrations available
              </div>
            ) : (
              <button 
                className="btn btn-primary btn-lg register-btn"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'Registering...' : 'Register for This Event'}
              </button>
            )}
          </div>

          {event.registeredUsers?.length > 0 && (
            <div className="participants-section">
              <h2>Registered Participants ({event.registeredUsers.length})</h2>
              <div className="participants-list">
                {event.registeredUsers.map((participant, index) => (
                  <div key={participant._id || index} className="participant-chip">
                    {participant.name || `Participant ${index + 1}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
