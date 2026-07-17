import React, { useState } from 'react';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface EditProfileProps {
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    whatsappPhone: '+1 234 567 8900',
    dateOfBirth: '1990-01-01'
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview('');
  };

  const handleSave = () => {
    console.log('Saving profile:', formData, 'Image:', profileImage);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-14 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}>
            <button
              onClick={onBack}
              className="flex items-center text-gray-900 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className={`w-5 h-5 ${
                isRTL ? 'rotate-180' : ''
              }`} />
            </button>
            <h1 className="text-base font-semibold text-gray-900">Edit Profile</h1>
            <button
              onClick={handleSave}
              className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 pb-8">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-3">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-black rounded-full p-1.5 shadow-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview && (
                <button
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3">Change Profile Picture</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          {/* Name */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`flex items-center px-4 py-3.5 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}>
              <label className={`text-sm text-gray-600 w-32 flex-shrink-0 ${
                isRTL ? 'text-right' : 'text-left'
              }`}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`flex-1 text-sm text-gray-900 bg-transparent focus:outline-none ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`flex items-center px-4 py-3.5 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}>
              <label className={`text-sm text-gray-600 w-32 flex-shrink-0 ${
                isRTL ? 'text-right' : 'text-left'
              }`}>
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsappPhone}
                onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
                className={`flex-1 text-sm text-gray-900 bg-transparent focus:outline-none ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                placeholder="Enter WhatsApp number"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`flex items-center px-4 py-3.5 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}>
              <label className={`text-sm text-gray-600 w-32 flex-shrink-0 ${
                isRTL ? 'text-right' : 'text-left'
              }`}>
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={`flex-1 text-sm text-gray-900 bg-transparent focus:outline-none ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-black hover:bg-gray-800 text-white py-3.5 px-4 rounded-xl font-medium transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
