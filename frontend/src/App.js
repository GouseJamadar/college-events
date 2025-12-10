import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import VerifyEmail from './pages/VerifyEmail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import MyEvents from './pages/MyEvents';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEvents from './pages/admin/AdminEvents';

const AppRoutes = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to={isAdmin ? "/admin" : "/events"} /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/events" /> : <Register />} 
      />
      <Route 
        path="/admin-login" 
        element={user ? <Navigate to={isAdmin ? "/admin" : "/events"} /> : <AdminLogin />} 
      />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      
      <Route 
        path="/events" 
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/events/:id" 
        element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-events" 
        element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute adminOnly>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/events" 
        element={
          <ProtectedRoute adminOnly>
            <AdminEvents />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22543d',
                },
              },
              error: {
                style: {
                  background: '#822727',
                },
              },
            }}
          />
        </div>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
