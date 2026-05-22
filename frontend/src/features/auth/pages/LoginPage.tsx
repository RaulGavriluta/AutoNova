import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosClient from '../../../config/axiosClient';
import { setCredentials } from '../store/authSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const fromLink = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      // Calls Spring Boot backend at POST http://localhost:8080/api/auth/login
      const response = await axiosClient.post('/auth/login', { email, password });
      
      // Dispatch the full AuthResponse data directly into Redux Store
      dispatch(setCredentials(response.data));
      
      navigate(fromLink, {replace: true});
    } catch (err: any) {
      setError(
        err.response?.data || 
        'Invalid email or password. Ensure Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 font-body-custom">
      <div className="bg-bg-main border border-border-custom p-8 rounded-2xl shadow-sm flex flex-col gap-6">
        
        <div className="text-center">
          <h1 className="text-3xl font-custom font-bold text-text-base">Welcome Back</h1>
          <p className="text-text-muted text-sm mt-2">Sign in to your AutoNova account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            disabled={loading}
            className="bg-primary hover:bg-primary-hover text-bg-surface font-medium rounded-xl p-3 mt-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer text-center text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-text-muted pt-2 border-t border-border-custom/40">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}