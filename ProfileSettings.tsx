
import React, { useState, useRef } from 'react';
import { User, Camera, Save, Building, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';

interface ProfileSettingsProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold dark:text-white">Profile Settings</h2>
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl"
          >
            <CheckCircle2 className="w-5 h-5" />
            Changes Saved
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center shadow-sm">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-3 rounded-full gradient-bg text-white shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
            <h3 className="text-xl font-bold dark:text-white">{formData.name}</h3>
            <p className="text-slate-500 text-sm">{formData.role || 'Owner'}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Building className="w-3 h-3" /> Business Name
                </label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.businessName || ''}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.phone || ''}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full py-5 rounded-[1.5rem] gradient-bg text-white font-bold text-xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                <Save className="w-6 h-6" />
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
