import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, Camera, Save } from 'lucide-react';

interface SellerSettingsProps {
  onBack: () => void;
}

const SellerSettings: React.FC<SellerSettingsProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'contacts'>('profile');

  const [profileData, setProfileData] = useState({
    storeName: 'Fashion Paradise Store',
    description: 'Welcome to Fashion Paradise! We offer the latest fashion trends at unbeatable prices. Quality guaranteed on all products.',
    location: 'Nouakchott, Mauritania',
    avatar: 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=800'
  });

  const [contactData, setContactData] = useState({
    phoneNumber: '+222 12 34 56 78',
    email: 'contact@fashionparadise.mr',
    whatsapp: '+222 12 34 56 78',
    address: 'Avenue Gamal Abdel Nasser, Nouakchott'
  });


  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };

  const handleSaveContacts = () => {
    console.log('Saving contacts:', contactData);
    alert('Contact information updated successfully!');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="flex items-center text-gray-900 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-gray-900">Seller Settings</h1>
            <div className="w-5"></div>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveSection('profile')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeSection === 'profile'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveSection('contacts')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeSection === 'contacts'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Phone className="w-4 h-4" />
                Contacts
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeSection === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Store Images</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Cover Image</label>
                  <div className="relative h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <img src={profileData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <button className="absolute bottom-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Store Logo</label>
                  <div className="relative w-20 h-20">
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Store Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Store Name</label>
                  <input
                    type="text"
                    value={profileData.storeName}
                    onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Description</label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactData.phoneNumber}
                  onChange={(e) => setContactData({ ...contactData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={contactData.whatsapp}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <textarea
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSaveContacts}
                className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Contacts
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SellerSettings;
