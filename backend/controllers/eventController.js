const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventRegistrationEmail } = require('../utils/sendEmail');

const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, category, maxParticipants, image } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      category,
      maxParticipants,
      image
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .sort({ date: 1 })
      .populate('registeredUsers', 'name registrationNumber email');

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

const getEventsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await Event.find({
      date: { $gte: startDate, $lte: endDate },
      isActive: true
    }).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events by month' });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredUsers', 'name registrationNumber email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, description, date, time, venue, category, maxParticipants, isActive, image } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.category = category || event.category;
    event.maxParticipants = maxParticipants || event.maxParticipants;
    event.isActive = isActive !== undefined ? isActive : event.isActive;
    event.image = image || event.image;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await User.updateMany(
      { registeredEvents: event._id },
      { $pull: { registeredEvents: event._id } }
    );

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isActive) {
      return res.status(400).json({ message: 'Event is not active' });
    }

    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.registeredUsers.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    user.registeredEvents.push(event._id);
    await user.save();

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error registering for event' });
  }
};

const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    event.registeredUsers = event.registeredUsers.filter(
      userId => userId.toString() !== req.user._id.toString()
    );
    await event.save();

    user.registeredEvents = user.registeredEvents.filter(
      eventId => eventId.toString() !== event._id.toString()
    );
    await user.save();

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error unregistering from event' });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('registeredEvents');
    res.json(user.registeredEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your events' });
  }
};

const getEventsGroupedByMonth = async (req, res) => {
  try {
    const { year } = req.params;
    const currentYear = parseInt(year) || new Date().getFullYear();

    const events = await Event.find({
      date: {
        $gte: new Date(currentYear, 0, 1),
        $lte: new Date(currentYear, 11, 31, 23, 59, 59)
      },
      isActive: true
    }).sort({ date: 1 });

    const groupedEvents = {};
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    monthNames.forEach((name, index) => {
      groupedEvents[index] = {
        name,
        events: []
      };
    });

    events.forEach(event => {
      const month = new Date(event.date).getMonth();
      groupedEvents[month].events.push(event);
    });

    res.json(groupedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching grouped events' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has ended
    if (new Date(event.date) > new Date()) {
      return res.status(400).json({ message: 'Can only give feedback after event ends' });
    }

    // Check if user was registered
    if (!event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Only registered participants can give feedback' });
    }

    // Check if already gave feedback
    const existingFeedback = event.feedback.find(f => f.user.toString() === req.user._id.toString());
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already given feedback' });
    }

    event.feedback.push({ user: req.user._id, rating, comment });
    await event.save();

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByMonth,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
  getEventsGroupedByMonth,
  addFeedback
};
