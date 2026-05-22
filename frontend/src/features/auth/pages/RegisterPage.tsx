import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../../config/axiosClient';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      // Calls Spring Boot backend at POST http://localhost:8080/api/auth/register
      await axiosClient.post('/auth/register', { firstName, lastName, email, password });
      
      setSuccess(true);
      // Give the user time to see the success state before redirecting
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(
        err.response?.data || 
        'Registration failed. Ensure Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 font-body-custom">
      <div className="bg-bg-main border border-border-custom p-8 rounded-2xl shadow-sm flex flex-col gap-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-custom font-bold text-text-base">Create Account</h1>
          <p className="text-text-muted text-sm mt-2">Join AutoNova premium parts network</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl text-center font-medium">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Alex"
                className="bg-bg-surface border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ionescu"
                className="bg-bg-surface border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@autonova.com"
              className="bg-bg-surface border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-bg-surface border border-border-custom text-text-base rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="bg-primary hover:bg-primary-hover text-bg-surface font-medium rounded-xl p-3 mt-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer text-center text-sm"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-sm text-text-muted pt-2 border-t border-border-custom/40">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}