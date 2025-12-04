import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-page">
      <div className="verify-container">
        {status === 'loading' && (
          <>
            <div className="verify-icon loading">
              <FiLoader />
            </div>
            <h1>Verifying Email...</h1>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verify-icon success">
              <FiCheckCircle />
            </div>
            <h1>Email Verified!</h1>
            <p>{message}</p>
            <Link to="/login" className="btn btn-primary">
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verify-icon error">
              <FiXCircle />
            </div>
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <Link to="/login" className="btn btn-secondary">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
