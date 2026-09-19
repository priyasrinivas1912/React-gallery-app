import React, { useState } from 'react';
import {
  User as UserIcon,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Building,
  Moon,
  Sun,
  Shield,
  Check,
  Edit2,
  Lock,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateProfileUpdate, hashPassword } from '../../utils/validation';

export const ProfileScreen: React.FC = () => {
  const { currentUser, logout, updateCurrentUser } = useAuthStore();
  const { isDarkMode, toggleDarkMode, setShowInspector } = useProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Profile form state
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    gender: currentUser?.gender || 'Female',
    mobile: currentUser?.mobile || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
  });

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validateProfileUpdate(formData);
    if (!val.isValid) {
      setErrors(val.errors);
      return;
    }

    setErrors({});
    await updateCurrentUser(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const hashed = await hashPassword(newPassword);
    await updateCurrentUser({ passwordHash: hashed });
    setPasswordSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordChange(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-8">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            User Account
          </span>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
            Profile Settings
          </h1>
        </div>

        <button
          type="button"
          id="btn-profile-edit-toggle"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile changes saved and persisted to local storage!</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4">
        {/* User Card */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
            }
            alt={currentUser?.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {currentUser?.fullName || 'Alex Morgan'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {currentUser?.email || 'alex.intern@example.com'}
            </p>
            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              React Native Intern
            </span>
          </div>
        </div>

        {/* View / Edit Form */}
        {isEditing ? (
          <form
            onSubmit={handleSaveProfile}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3"
          >
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
              Edit Personal Info
            </h3>

            <AppInput
              id="edit-fullname"
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
              icon={<UserIcon className="w-4 h-4" />}
            />

            <AppInput
              id="edit-email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Gender
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                {['Male', 'Female', 'Other', 'Prefer Not'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender })}
                    className={`py-1 text-xs font-semibold rounded-lg transition-all ${
                      formData.gender === gender
                        ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <AppInput
              id="edit-mobile"
              label="Mobile Number"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              error={errors.mobile}
              icon={<Phone className="w-4 h-4" />}
            />

            <div className="grid grid-cols-2 gap-2">
              <AppInput
                id="edit-city"
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={errors.city}
                icon={<Building className="w-4 h-4" />}
              />
              <AppInput
                id="edit-address"
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address}
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2 flex gap-2">
              <AppButton
                id="btn-save-profile"
                title="Save Changes"
                type="submit"
                size="md"
              />
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-0.5">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[10px] block">Gender</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser?.gender || 'Female'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[10px] block">Mobile</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser?.mobile || '+1 (555) 234-5678'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 col-span-2">
                <span className="text-slate-400 text-[10px] block">Address & City</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser?.address || '42 Silicon Avenue'}, {currentUser?.city || 'San Francisco'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Security & Password */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Security & Password
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {showPasswordChange ? 'Close' : 'Change Password'}
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            <p>
              Stored with cryptographic SHA-256 hash. Simulates React Native Expo Crypto.
            </p>
          </div>

          {showPasswordChange && (
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <AppInput
                id="profile-new-password"
                label="New Password"
                placeholder="••••••••"
                isPassword
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />
              <AppInput
                id="profile-confirm-password"
                label="Confirm New Password"
                placeholder="••••••••"
                isPassword
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />
              {passwordError && (
                <p className="text-xs text-rose-500 font-medium">• {passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Password updated and hashed!
                </p>
              )}
              <AppButton
                id="btn-update-password-submit"
                title="Update Password"
                type="submit"
                size="sm"
                variant="secondary"
              />
            </form>
          )}
        </div>

        {/* Preferences: Dark Mode & Submission Checker */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Preferences & Tools
          </h3>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Dark Mode
              </span>
            </div>
            <button
              type="button"
              id="btn-toggle-dark-mode-profile"
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Intern Assignment Checklist
              </span>
            </div>
            <button
              type="button"
              id="btn-open-checklist-from-profile"
              onClick={() => setShowInspector(true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Open Reviewer
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <AppButton
            id="btn-logout"
            title="Sign Out"
            variant="danger"
            size="md"
            icon={<LogOut className="w-4 h-4" />}
            onClick={() => logout()}
          />
        </div>
      </div>
    </div>
  );
};
