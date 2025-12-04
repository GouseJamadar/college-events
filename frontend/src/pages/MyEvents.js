import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiCalendar, FiMapPin, FiClock, FiX } from 'react-icons/fi';
import './MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/events/my-events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    try {
      await api.post(`/events/${eventId}/unregister`);
      toast.success('Successfully unregistered from event');
      fetchMyEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unregister');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  if (loading) {
    return (
      <div className="my-events-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your events...</p>
        </div>
      </div>
    );
  }

  const upcomingEvents = events.filter(e => isUpcoming(e.date));
  const pastEvents = events.filter(e => !isUpcoming(e.date));

  return (
    <div className="my-events-page">
      <h1>My Registered Events</h1>

      {events.length === 0 ? (
        <div className="empty-state">
          <FiCalendar className="empty-icon" />
          <h2>No Events Yet</h2>
          <p>You haven't registered for any events yet.</p>
          <a href="/events" className="btn btn-primary">Browse Events</a>
        </div>
      ) : (
        <>
          <section className="events-section">
            <h2>Upcoming Events ({upcomingEvents.length})</h2>
            {upcomingEvents.length === 0 ? (
              <p className="no-events">No upcoming events</p>
            ) : (
              <div className="events-grid">
                {upcomingEvents.map(event => (
                  <div key={event._id} className="my-event-card upcoming">
                    <div className="event-badge upcoming">Upcoming</div>
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span><FiCalendar /> {formatDate(event.date)}</span>
                      <span><FiClock /> {event.time}</span>
                      <span><FiMapPin /> {event.venue}</span>
                    </div>
                    <button 
                      className="btn-unregister"
                      onClick={() => handleUnregister(event._id)}
                    >
                      <FiX /> Cancel Registration
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="events-section">
            <h2>Past Events ({pastEvents.length})</h2>
            {pastEvents.length === 0 ? (
              <p className="no-events">No past events</p>
            ) : (
              <div className="events-grid">
                {pastEvents.map(event => (
                  <div key={event._id} className="my-event-card past">
                    <div className="event-badge past">Completed</div>
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span><FiCalendar /> {formatDate(event.date)}</span>
                      <span><FiClock /> {event.time}</span>
                      <span><FiMapPin /> {event.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default MyEvents;
