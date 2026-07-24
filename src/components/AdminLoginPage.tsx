import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      if (user.role !== 'admin') {
        setError('عذراً، هذا الحساب لا يملك صلاحيات المسؤول (Admin)');
        return;
      }
      login(token, user);
      toast.success('مرحباً بك في لوحة تحكم الأدمن!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Desktop Dashboard Container */}
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] z-10">
        
        {/* Left Side: Brand & Visual Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-black via-zinc-900 to-zinc-950 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-black tracking-tight text-white font-sans">
                bootig
              </span>
              <span className="bg-[#FFC700] text-black text-[10px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
                ADMIN
              </span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight mb-3">
              Management Portal
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Welcome back. Access the administration dashboard to manage stores, orders, products, and system settings.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center gap-3 text-zinc-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#FFC700]" />
            <span>Secure Web Management Console</span>
          </div>
        </div>

        {/* Right Side: Login Form Panel */}
        <div className="lg:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Sign in to Admin Dashboard
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Enter your administrative credentials to continue.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-black hover:bg-zinc-800 text-white font-bold py-4 px-6 rounded-xl text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-black/10 active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>LOG IN TO DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
