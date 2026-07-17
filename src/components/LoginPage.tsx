import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // حقول تسجيل الدخول
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // حقول التسجيل
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        username: loginUsername.trim(),
        password: loginPassword,
      });
      const { token, user } = response.data;
      login(token, user);
      toast.success('مرحبًا بك!');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'vendor') {
        navigate('/my-store');
      } else {
        navigate('/category/woman');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين');
      return;
    }
    if (regPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register-customer', {
        name: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        username: regUsername.trim(),
        password: regPassword,
        confirmPassword: confirmPassword,
      });
      toast.success('تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن');
      setPhoneNumber('');
      setRegUsername(''); setRegPassword(''); setConfirmPassword('');
      setFullName('');
      setMode('login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء التسجيل');
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
      {/* Container simulating a phone screen */}
      <div className="w-full min-h-screen md:min-h-[812px] md:h-[812px] md:w-[375px] bg-white md:shadow-2xl p-8 flex flex-col justify-between relative overflow-y-auto scrollbar-hide">
        
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10 mt-8 select-none">
            <div className="flex flex-col items-center">
              <span className="text-[44px] font-black tracking-tighter text-black leading-none font-sans">bootig</span>
            </div>
          </div>

          {/* العنوان */}
          <div className="text-right mb-6">
            <h1 className="text-xl font-bold text-gray-900 font-sans">مرحبًا بك</h1>
            <p className="text-gray-500 text-xs mt-1 font-sans">
              {mode === 'login' ? 'سجل الدخول للمتابعة' : 'إنشاء حساب مستخدم جديد'}
            </p>
          </div>

          {/* تبديل الوضع */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-md transition-colors ${
                  mode === 'login' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                تسجيل دخول
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-md transition-colors ${
                  mode === 'register' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                إنشاء حساب
              </button>
            </div>
          </div>

          {/* ─── فورم تسجيل الدخول ─── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} dir="rtl">
              <div className="mb-4">
                <label htmlFor="loginUsername" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  اسم المستخدم
                </label>
                <input
                  id="loginUsername"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                  placeholder="أدخل اسم المستخدم"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="loginPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                    placeholder="أدخل كلمة المرور"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-4 font-sans">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-sans"
              >
                {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
              </button>
            </form>
          )}

          {/* ─── فورم تسجيل مستخدم جديد ─── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} dir="rtl">
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  الاسم الكامل
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  رقم الهاتف
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                  placeholder="+222 XXXXXXXX"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="regUsername" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  اسم المستخدم
                </label>
                <input
                  id="regUsername"
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                  placeholder="سيُستخدم لتسجيل الدخول"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="regPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                    placeholder="6 أحرف على الأقل"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-right mb-2 font-sans">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-right font-sans"
                    placeholder="أعد كتابة كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-4 font-sans">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors font-sans"
              >
                {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
              </button>
            </form>
          )}
        </div>

        {/* ─── رابط الانتقال لبوابة التجار والمسؤولين ─── */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100 flex flex-col pb-2">
          <button
            type="button"
            onClick={() => navigate('/vendor/login')}
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors font-sans"
          >
            تسجيل دخول التجار والمسؤولين &larr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
