import React from 'react';
import { ArrowLeft, Check, Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  onBack: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onBack }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' }
  ];

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    // Save to localStorage for persistence
    localStorage.setItem('wetruss-language', langCode);
    setTimeout(() => onBack(), 300); // Small delay for visual feedback
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''} mr-2`} />
              <span className="hidden sm:inline">{t('common.back')}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">{t('language.title')}</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Language Options */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-yellow-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{t('language.title')}</h2>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${language === lang.code ? 'bg-yellow-50' : ''
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-8 rounded border-2 flex items-center justify-center text-xs font-bold ${lang.code === 'en' ? 'bg-blue-500 text-white border-blue-500' :
                      lang.code === 'ar' ? 'bg-green-500 text-white border-green-500' :
                        'bg-red-500 text-white border-red-500'
                    }`}>
                    {lang.code.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{lang.nativeName}</p>
                    <p className="text-sm text-gray-600">{lang.name}</p>
                  </div>
                </div>

                {language === lang.code && (
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">Selected</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Language Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Language Support</h3>
              <p className="text-sm text-blue-700 mt-1">
                The app interface will be displayed in your selected language.
                Product names and descriptions may still appear in their original language.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;