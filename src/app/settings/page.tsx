'use client';

import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconUser,
  IconBuildingStore,
  IconLock,
  IconBell,
  IconApi,
  IconMail,
  IconPhone,
  IconCreditCard,
  IconBrandStripe,
  IconKey,
  IconDeviceMobile,
  IconBrandGoogle,
  IconWorld,
  IconCurrency,
  IconLanguage,
  IconPalette,
  IconDeviceFloppy,
  IconTrash,
  IconUpload,
  IconCheck
} from '@tabler/icons-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  stockAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

interface ProfileSettings {
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const sections: SettingsSection[] = [
  { id: 'profile', title: 'Profile Settings', icon: <IconUser className="w-5 h-5" /> },
  { id: 'store', title: 'Store Settings', icon: <IconBuildingStore className="w-5 h-5" /> },
  { id: 'security', title: 'Security', icon: <IconLock className="w-5 h-5" /> },
  { id: 'notifications', title: 'Notifications', icon: <IconBell className="w-5 h-5" /> },
  { id: 'api', title: 'API Settings', icon: <IconApi className="w-5 h-5" /> }
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const defaultProfileSettings: ProfileSettings = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Store Administrator'
  };
  
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>(defaultProfileSettings);
  const [originalSettings, setOriginalSettings] = useState<ProfileSettings>(defaultProfileSettings);

  const [storeSettings, setStoreSettings] = useState({
    name: 'My Awesome Store',
    email: 'contact@store.com',
    phone: '+1 (555) 123-4567',
    currency: 'USD',
    language: 'English',
    timezone: 'UTC-5'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    stockAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveChanges = () => {
    if (activeSection === 'profile') {
    // Save the current state as the original state
    setOriginalSettings({ ...profileSettings });
    setOriginalImage(profileImage);
      showToast('Profile changes have been saved successfully', 'success');
    }
    // Add handlers for other sections here
  };

  const handleReset = () => {
    if (activeSection === 'profile') {
      // Always reset to default placeholder values
      setProfileSettings(defaultProfileSettings);
      setProfileImage(null);
      showToast('Profile has been reset to default state', 'success');
    }
    // Add handlers for other sections here
  };

  const handleProfileUpdate = (field: keyof ProfileSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileSettings(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or SVG)');
      return;
    }

    // Create URL for preview
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const Toast = () => {
    if (!toast || !isMounted) return null;

    return (
      <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        <motion.div
            key="toast"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <IconCheck className="w-5 h-5 text-white" />
          <span className="text-white">{toast.message}</span>
        </motion.div>
      </AnimatePresence>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-background-dark overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconUser className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept=".jpg,.jpeg,.png,.svg"
                  className="hidden"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 bg-primary rounded-full p-2"
                  onClick={triggerFileInput}
                >
                  <IconUpload className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
                <p className="text-gray-400 text-sm">Upload a new profile picture (JPG, PNG, SVG)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                  value={profileSettings.fullName}
                  onChange={handleProfileUpdate('fullName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="john@example.com"
                  value={profileSettings.email}
                  onChange={handleProfileUpdate('email')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+1 (555) 123-4567"
                  value={profileSettings.phone}
                  onChange={handleProfileUpdate('phone')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                <input
                  type="text"
                  className="w-full bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profileSettings.role}
                  disabled
                />
              </div>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Store Name</label>
                <div className="flex items-center space-x-2">
                  <IconBuildingStore className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Store Email</label>
                <div className="flex items-center space-x-2">
                  <IconMail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Store Phone</label>
                <div className="flex items-center space-x-2">
                  <IconPhone className="w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                <div className="flex items-center space-x-2">
                  <IconCurrency className="w-5 h-5 text-gray-400" />
                  <select
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                <div className="flex items-center space-x-2">
                  <IconLanguage className="w-5 h-5 text-gray-400" />
                  <select
                    value={storeSettings.language}
                    onChange={(e) => setStoreSettings({ ...storeSettings, language: e.target.value })}
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                <div className="flex items-center space-x-2">
                  <IconWorld className="w-5 h-5 text-gray-400" />
                  <select
                    value={storeSettings.timezone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, timezone: e.target.value })}
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-background-dark rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Gateway</h3>
              <div className="flex items-center space-x-4">
                <IconBrandStripe className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="text-white font-medium">Stripe</p>
                  <p className="text-gray-400 text-sm">Connected</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-background px-4 py-2 rounded-lg text-white"
                >
                  Configure
                </motion.button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-background-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <IconDeviceMobile className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-white font-medium">Authenticator App</p>
                    <p className="text-gray-400 text-sm">Secure your account with 2FA</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary px-4 py-2 rounded-lg text-white"
                >
                  Enable 2FA
                </motion.button>
              </div>
            </div>

            <div className="bg-background-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Connected Accounts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <IconBrandGoogle className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-white font-medium">Google</p>
                      <p className="text-gray-400 text-sm">Connected</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-background px-4 py-2 rounded-lg text-white"
                  >
                    Disconnect
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="bg-background-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <IconKey className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-white font-medium">Production API Key</p>
                      <p className="text-gray-400 text-sm">Last used: 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-background px-4 py-2 rounded-lg text-white"
                    >
                      Regenerate
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-red-500 px-4 py-2 rounded-lg text-white"
                    >
                      Revoke
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-background-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {(Object.keys(notificationSettings) as Array<keyof NotificationSettings>).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Receive notifications for {key.toLowerCase()}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[key]}
                        onChange={() => setNotificationSettings(prev => ({
                          ...prev,
                          [key]: !prev[key]
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="bg-background-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">API Documentation</h3>
                  <p className="text-gray-400">Access our API documentation and resources</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary px-4 py-2 rounded-lg text-white"
                >
                  View Docs
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-background rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Production API Key</p>
                      <p className="text-gray-400 text-sm font-mono">sk_live_•••••••••••••••••</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-background-dark px-4 py-2 rounded-lg text-white"
                    >
                      Show
                    </motion.button>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Test API Key</p>
                      <p className="text-gray-400 text-sm font-mono">sk_test_•••••••••••••••••</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-background-dark px-4 py-2 rounded-lg text-white"
                    >
                      Show
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Webhook URL</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="https://your-domain.com/api/webhook"
                    readOnly
                    className="flex-1 bg-background rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-background-dark px-4 py-2 rounded-lg text-white"
                  >
                    Copy
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="bg-background-dark rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">API Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Requests (This Month)</span>
                    <span>80% of limit</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Requests</p>
                    <p className="text-white font-bold text-xl">80,000</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-white font-bold text-xl">99.9%</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Avg. Latency</p>
                    <p className="text-white font-bold text-xl">145ms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-background-dark rounded-xl p-4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {section.icon}
                <span>{section.title}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-background-dark rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white flex items-center space-x-2"
                  onClick={handleReset}
                >
                  <IconTrash className="w-5 h-5" />
                  <span>Reset</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary px-4 py-2 rounded-lg text-white flex items-center space-x-2"
                  onClick={handleSaveChanges}
                >
                  <IconDeviceFloppy className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
      <Toast />
    </DashboardLayout>
  );
} 