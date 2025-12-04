const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required']
  },
  category: {
    type: String,
    enum: ['technical', 'cultural', 'sports', 'academic', 'workshop', 'seminar', 'other'],
    default: 'other'
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

eventSchema.virtual('month').get(function() {
  return this.date.getMonth();
});

eventSchema.virtual('year').get(function() {
  return this.date.getFullYear();
});

eventSchema.virtual('registrationCount').get(function() {
  return this.registeredUsers.length;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
