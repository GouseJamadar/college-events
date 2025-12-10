const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'https://college-events-kn3q-git-main-mohammed-gouses-projects.vercel.app',
      'https://college-events-kn3q.vercel.app'
    ];
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed?.replace(/\/$/, '')))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/config', (req, res) => {
  res.json({
    collegeName: process.env.COLLEGE_NAME || 'KLE BCA Hubli',
    regNumberFormat: parseInt(process.env.REG_NUMBER_FORMAT) || 6
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'College Event Management API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
