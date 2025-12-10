
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { registrationNumber, email, password, name } = req.body;

    const regNumLength = parseInt(process.env.REG_NUMBER_FORMAT) || 6;
    const regNumRegex = new RegExp(`^\\d{${regNumLength}}$`);
    
    if (!regNumRegex.test(registrationNumber)) {
      return res.status(400).json({ 
        message: `Registration number must be exactly ${regNumLength} digits` 
      });
    }

    const userExists = await User.findOne({ 
      $or: [{ registrationNumber }, { email }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'User with this registration number or email already exists' 
      });
    }

    const user = await User.create({
      registrationNumber,
      email,
      password,
      name,
      isVerified: true
    });

    res.status(201).json({
      message: 'Registration successful! You can now login.',
      user: {
        id: user._id,
        registrationNumber: user.registrationNumber,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    const user = await User.findOne({ registrationNumber });

    if (!user) {
      return res.status(401).json({ message: 'Invalid registration number or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid registration number or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        registrationNumber: user.registrationNumber,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL, role: 'admin' });

      if (!adminUser) {
        adminUser = await User.create({
          registrationNumber: 'ADMIN001',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          name: 'Administrator',
          isVerified: true,
          role: 'admin'
        });
      }

      return res.json({
        token: generateToken(adminUser._id),
        user: {
          id: adminUser._id,
          email: adminUser.email,
          name: adminUser.name,
          role: 'admin'
        }
      });
    }

    const adminUser = await User.findOne({ email, role: 'admin' });

    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await adminUser.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.json({
      token: generateToken(adminUser._id),
      user: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('registeredEvents');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resendVerification = async (req, res) => {
  try {
    res.json({ message: 'Verification not required' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  adminLogin,
  getProfile,
  resendVerification
}