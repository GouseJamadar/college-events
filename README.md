# College Event Management System

A full-stack MERN application for managing college events with user registration, email verification, and admin panel.

## Features

- **User Registration & Authentication**
  - Students register using their college registration number
  - Email verification system
  - JWT-based authentication

- **Event Management**
  - Monthly event listing
  - Event categories (Technical, Cultural, Sports, etc.)
  - Event registration with capacity limits

- **Admin Panel**
  - Dashboard with statistics
  - User management (view, verify, delete)
  - Event CRUD operations
  - View event registrations

## Tech Stack

- **Frontend**: React.js, React Router, Axios, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Email**: Nodemailer

## Project Structure

```
college-events/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email sending)

### 1. Clone/Setup the Project

Open the `college-events` folder in VS Code.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
copy .env.example .env
```

Edit the `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/college_events
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@klebcahubli.edu
ADMIN_PASSWORD=your_admin_password
PORT=5000
FRONTEND_URL=http://localhost:3000
COLLEGE_NAME=KLE BCA Hubli
REG_NUMBER_FORMAT=6
```

**Important**: For Gmail, you need to use an App Password:
1. Go to Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate a new app password for "Mail"
4. Use that password in `EMAIL_PASS`

```bash
# Start the backend server
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Admin Login

Use the admin credentials from your `.env` file:
- Email: `admin@klebcahubli.edu` (or your ADMIN_EMAIL)
- Password: Your ADMIN_PASSWORD

## Configuration Options

### Registration Number Format

The `REG_NUMBER_FORMAT` in `.env` specifies how many digits the registration number should have. For example:
- `6` for numbers like `223323`
- `8` for numbers like `22433010`

### College Name

Set your college name in `COLLEGE_NAME` to display throughout the application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify/:token` - Email verification
- `GET /api/auth/profile` - Get user profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/grouped/:year` - Get events grouped by month
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/unregister` - Unregister from event
- `GET /api/events/my-events` - Get user's registered events

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/verify` - Manually verify user
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

## Screenshots

The application includes:
- Modern, responsive landing page
- User-friendly registration and login forms
- Monthly calendar view for events
- Professional admin dashboard
- Interactive event cards with registration

## Security Features

- Passwords hashed with bcrypt
- JWT token authentication
- Protected routes for users and admins
- Email verification required for event registration
- No hardcoded sensitive data

## License

MIT License
