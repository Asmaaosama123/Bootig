import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, LogOut, User, Camera, Save, X, Edit3, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import BottomNav from './BottomNav';

interface UserProfileProps {
  onBack?: () => void;
  logout: () => void;
  onOpenMyStore?: () => void;
  user?: { role?: string } | null;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onBack,
  logout,
  onOpenMyStore,
  user: userProp = null,
}) => {
  const { t, isRTL } = useLanguage();
  const { user: contextUser, updateUser } = useAuth();
  const user = userProp ?? contextUser;
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  // Load latest profile info from API on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        const data = response.data;
        setName(data.name || '');
        setWhatsapp(data.whatsapp || '');
      } catch (err) {
        console.error('Failed to fetch profile details:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/auth/profile', {
        name: name.trim(),
        whatsApp: whatsapp.trim()
      });

      // Update local storage and authentication context state
      if (updateUser && response.data.user) {
        updateUser(response.data.user);
      }

      toast.success('تم تحديث الملف الشخصي بنجاح');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حفظ التعديلات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b py-3 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mr-3 text-gray-900">{t('profile.title') || 'Profile'}</h2>
          </div>
          {user && user.role === 'admin' && (
            <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 max-w-7xl mx-auto w-full">
        {/* User Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 mb-4 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center text-yellow-750 font-bold text-3xl mb-4 shadow-inner relative border-4 border-white">
            {name ? name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
          </div>

          <h2 className="text-xl font-bold text-gray-950 mb-1">{name || 'User'}</h2>
          <p className="text-xs text-gray-450 uppercase tracking-wider font-semibold bg-gray-100 px-3 py-1 rounded-full">{user?.role || 'Customer'}</p>
        </div>

        {/* Vendor: My Store button */}
        {user && user.role === 'vendor' && (
          <div className="mb-4">
            <button
              onClick={() => { if (onOpenMyStore) onOpenMyStore(); else navigate('/my-store'); }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow transition-colors flex items-center justify-center gap-2"
            >
              <span>لوحة المتجر الخاص بي</span>
            </button>
          </div>
        )}

        {/* Info card & Edit state */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 mb-4">
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm font-semibold text-gray-900 uppercase">البيانات الشخصية</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs text-yellow-600 font-bold hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل البيانات</span>
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">الاسم الكامل</p>
                <p className="text-sm font-medium text-gray-800 mt-1">{name || '—'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">رقم الواتساب</p>
                <p className="text-sm font-medium text-gray-800 mt-1">{whatsapp || '—'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                <span className="text-sm font-semibold text-gray-900 uppercase">تعديل البيانات</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                    }}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">الاسم الكامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-yellow-500 bg-gray-50/50"
                  placeholder="أدخل اسمك الكامل"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">رقم الواتساب</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-yellow-500 bg-gray-50/50"
                  placeholder="مثال: +966500000000"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black hover:bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={`w-full bg-white hover:bg-red-50 text-red-500 py-3.5 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm border border-red-100 ${isRTL ? 'flex-row-reverse' : ''
            }`}
        >
          <LogOut className="w-5 h-5" />
          <span>{t('profile.logout') || 'تسجيل الخروج'}</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

// Simple inline spinner helper
const Loader2: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default UserProfile;
