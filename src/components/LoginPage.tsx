import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Inputs
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // إرسال طلب OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/send-otp', {
        phoneNumber: phoneNumber.trim(),
        name: mode === 'register' ? fullName.trim() : undefined,
        mode: mode,
      });

      toast.success('تم إرسال كود التحقق بنجاح');
      setStep('otp');
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp?.code === 'USER_NOT_FOUND') {
        setError(resp.message);
        toast.error('هذا الرقم غير مسجل، تم تحويلك لإنشاء حساب جديد');
        setMode('register');
      } else if (resp?.code === 'USER_ALREADY_EXISTS') {
        setError(resp.message);
        toast.error('هذا الرقم مسجل بالفعل، تم تحويلك لتسجيل الدخول');
        setMode('login');
      } else {
        setError(resp?.message || 'حدث خطأ أثناء إرسال كود التحقق. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  // التحقق من كود الـ OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('يرجى إدخال كود التحقق');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
        name: mode === 'register' ? fullName.trim() : undefined,
        mode: mode,
      });

      const { token, user } = response.data;
      login(token, user);
      toast.success('مرحبًا بك في Bootig!');

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'vendor') {
        navigate('/my-store');
      } else {
        navigate('/category/woman');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'كود التحقق غير صحيح أو انتهت صلاحيته');
    } finally {
      setLoading(false);
    }
  };

  // تخطي تسجيل الدخول (زائر)
  const handleSkip = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/guest-login');
      const { token, user } = response.data;
      login(token, user);
      toast('تم الدخول كـ زائر', { icon: '👋' });
      navigate('/category/woman');
    } catch (err) {
      // Fallback local guest login if backend is unavailable
      const guestUser = { _id: 'guest', name: 'زائر Bootig', role: 'customer' as const };
      login('guest-token', guestUser);
      navigate('/category/woman');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setStep('phone');
    setError('');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 md:bg-zinc-900 flex items-center justify-center p-0 md:p-4 font-sans">
      {/* Mobile-frame mock container matching the exact Bootig design */}
      <div className="w-full min-h-screen md:min-h-[750px] md:h-[750px] md:w-[390px] bg-white md:rounded-[36px] md:shadow-2xl px-7 py-10 flex flex-col justify-between relative overflow-y-auto scrollbar-hide">
        
        {/* Top Header & Brand */}
        <div className="flex flex-col items-center pt-4">
          {/* Logo */}
          <div className="mb-12 text-center select-none">
            <span className="text-[46px] font-black tracking-tight text-black leading-none font-sans block">
              bootig
            </span>
          </div>

          {/* Page Title */}
          <h2 className="text-sm font-bold tracking-[0.15em] text-gray-900 uppercase text-center mb-8">
            {step === 'otp' ? 'VERIFY OTP CODE' : (mode === 'login' ? 'LOG IN TO YOUR ACCOUNT' : 'CREATE YOUR ACCOUNT')}
          </h2>

          {/* Mode Switcher Buttons */}
          {step === 'phone' && (
            <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50 w-full mb-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 text-center py-2 text-xs font-bold transition-all rounded-md uppercase ${
                  mode === 'login' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                LOG IN
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 text-center py-2 text-xs font-bold transition-all rounded-md uppercase ${
                  mode === 'register' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                REGISTER
              </button>
            </div>
          )}

          {/* Step 1: Input Phone / Name */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
              {mode === 'register' && (
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="FULL NAME"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-center font-bold text-sm tracking-wider text-black placeholder:text-gray-400 placeholder:font-medium uppercase focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="PHONE NUMBER"
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-center font-bold text-sm tracking-wider text-black placeholder:text-gray-400 placeholder:font-medium uppercase focus:outline-none focus:border-black transition-colors"
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center font-medium my-1">
                  {error}
                </p>
              )}

              {/* Main Submit Button (Yellow Button from mockup) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFC700] hover:bg-[#F2BD00] text-black font-black py-4 uppercase tracking-wider text-sm transition-transform active:scale-[0.99] disabled:opacity-60 shadow-sm mt-4 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={16} /> SENDING SMS...
                  </span>
                ) : (
                  mode === 'login' ? 'LOG IN' : 'SEND CODE'
                )}
              </button>
            </form>
          )}

          {/* Step 2: Input OTP Verification Code */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
              <p className="text-xs text-gray-500 text-center mb-2">
                Sent to <span className="font-bold text-black" dir="ltr">{phoneNumber}</span>
              </p>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="ENTER 4-DIGIT CODE"
                  className="w-full px-4 py-4 border-2 border-black rounded-none text-center font-black text-lg tracking-[0.4em] text-black placeholder:text-gray-400 placeholder:text-xs placeholder:tracking-wider uppercase focus:outline-none transition-colors"
                  required
                  autoFocus
                  dir="ltr"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs text-center font-medium my-1">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFC700] hover:bg-[#F2BD00] text-black font-black py-4 uppercase tracking-wider text-sm transition-transform active:scale-[0.99] disabled:opacity-60 shadow-sm mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={16} /> VERIFYING...
                  </span>
                ) : (
                  'VERIFY & CONTINUE'
                )}
              </button>

              <div className="flex items-center justify-between text-xs mt-2 px-1">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-gray-500 hover:text-black font-semibold underline"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-black font-bold hover:underline"
                >
                  Resend SMS
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
