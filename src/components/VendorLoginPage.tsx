import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VendorLoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register-only states
  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password: password,
      });
      const { token, user } = response.data;
      login(token, user);
      toast.success('Welcome back!');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'vendor') {
        navigate('/my-store');
      } else {
        navigate('/category/woman');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register-vendor', {
        storeName: storeName.trim(),
        storeDescription: '',
        phoneNumber: whatsappNumber.trim(),
        username: username.trim(),
        password: password,
        confirmPassword: confirmPassword,
        coverUrl: '',
        logoUrl: ''
      });
      toast.success('Registration successful! You can now log in.');
      setStoreName('');
      setUsername('');
      setWhatsappNumber('');
      setPassword('');
      setConfirmPassword('');
      setMode('login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 md:bg-gradient-to-tr md:from-zinc-950 md:via-zinc-900 md:to-zinc-950 flex items-center justify-center p-0 md:p-4">
      {/* Container simulating the white mockup screen */}
      <div className="w-full min-h-screen md:min-h-[812px] md:h-[812px] md:w-[375px] bg-white md:shadow-2xl p-8 flex flex-col justify-between relative overflow-y-auto scrollbar-hide">
        
        {/* Top Section */}
        <div className="flex flex-col flex-grow">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-12 mt-8 select-none">
            <div className="flex flex-col items-start">
              <span className="text-[44px] font-black tracking-tighter text-black leading-none font-sans">bootig</span>
              <span className="text-[11px] font-extrabold text-[#FFC000] tracking-widest uppercase mt-0.5 leading-none">
                Vendor
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="w-full text-left mb-5">
            <h2 className="text-sm font-extrabold text-black tracking-wider font-sans select-none">
              {mode === 'login' ? 'LOG-IN' : 'LOG-UP'}
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2 border-l-2 border-red-500 text-left">
              {error}
            </div>
          )}

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col space-y-3.5">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
                autoComplete="current-password"
              />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-extrabold py-3 text-xs tracking-widest hover:bg-zinc-800 disabled:bg-gray-400 transition-colors uppercase font-sans mt-3"
              >
                {loading ? 'Processing...' : 'LOG-IN'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col space-y-3.5">
              <input
                type="text"
                placeholder="Store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
                autoComplete="username"
              />
              <input
                type="tel"
                placeholder="Whatsapp number"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black placeholder-gray-400 bg-white text-black font-sans"
                required
                autoComplete="new-password"
              />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-extrabold py-3 text-xs tracking-widest hover:bg-zinc-800 disabled:bg-gray-400 transition-colors uppercase font-sans mt-3"
              >
                {loading ? 'Processing...' : 'LOG-UP'}
              </button>
            </form>
          )}
        </div>

        {/* Bottom Toggle Button & Switch Portal Link */}
        <div className="flex flex-col space-y-3 mt-10">
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="w-full bg-[#FFC000] text-black font-extrabold py-3.5 text-xs tracking-widest hover:bg-[#E0A800] transition-colors uppercase font-sans"
          >
            {mode === 'login' ? 'LOG-UP' : 'LOG-IN'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4 self-center uppercase tracking-wider font-sans"
          >
            Go to Customer Portal
          </button>
        </div>

      </div>
    </div>
  );
};

export default VendorLoginPage;
