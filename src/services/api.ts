import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL if provided, default to local proxy /api in dev, and fallback to production API in build
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://api.bootig.store/api'),
});

// هذا هو الجزء الأهم: يقوم بإرفاق التوكن مع كل طلب تلقائيًا
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // <-- يبحث عن التوكن بالاسم الصحيح
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// التعامل مع انتهاء صلاحية التوكن أو التوكن التالف (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;