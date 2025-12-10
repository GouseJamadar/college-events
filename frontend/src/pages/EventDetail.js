import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowLeft, FiCheck, FiStar } from 'react-icons/fi';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

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

  const handleFeedback = async () => {
    try {
      await api.post(`/events/${id}/feedback`, { rating, comment });
      toast.success('Feedback submitted!');
      setShowFeedback(false);
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const isEventEnded = new Date(event?.date) < new Date();
  const hasGivenFeedback = event?.feedback?.some(f => f.user === user?.id || f.user?._id === user?.id);
  const averageRating = event?.feedback?.length > 0 
    ? (event.feedback.reduce((sum, f) => sum + f.rating, 0) / event.feedback.length).toFixed(1)
    : null;

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

          {/* Feedback Section */}
          {isEventEnded && isRegistered && (
            <div className="feedback-section">
              <h2><FiStar /> Event Feedback {averageRating && `(${averageRating}/5)`}</h2>
              
              {hasGivenFeedback ? (
                <p className="feedback-submitted">✓ You have already submitted feedback</p>
              ) : (
                <>
                  {!showFeedback ? (
                    <button className="btn btn-primary" onClick={() => setShowFeedback(true)}>
                      Give Feedback
                    </button>
                  ) : (
                    <div className="feedback-form">
                      <div className="rating-input">
                        <label>Rating:</label>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star}
                              className={`star-btn ${rating >= star ? 'active' : ''}`}
                              onClick={() => setRating(star)}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Share your experience (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <div className="feedback-actions">
                        <button className="btn btn-secondary" onClick={() => setShowFeedback(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleFeedback}>Submit Feedback</button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {event.feedback?.length > 0 && (
                <div className="feedback-list">
                  <h3>Reviews ({event.feedback.length})</h3>
                  {event.feedback.slice(0, 5).map((fb, i) => (
                    <div key={i} className="feedback-item">
                      <div className="feedback-rating">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</div>
                      {fb.comment && <p>{fb.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
