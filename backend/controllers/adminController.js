const User = require('../models/User');
const Event = require('../models/Event');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('registeredEvents', 'title date')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('registeredEvents');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await Event.updateMany(
      { registeredUsers: user._id },
      { $pull: { registeredUsers: user._id } }
    );

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
    const unverifiedUsers = await User.countDocuments({ role: 'user', isVerified: false });
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });

    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(5);

    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        totalEvents,
        activeEvents
      },
      upcomingEvents,
      recentUsers,
      eventsByCategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('registeredUsers', 'name registrationNumber email isVerified createdAt');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        maxParticipants: event.maxParticipants
      },
      registrations: event.registeredUsers,
      totalRegistrations: event.registeredUsers.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching registrations' });
  }
};

const verifyUserManually = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying user' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  getDashboardStats,
  getEventRegistrations,
  verifyUserManually
};
