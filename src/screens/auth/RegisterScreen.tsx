import React, { useState } from 'react';
import { UserPlus, ArrowLeft, Mail, Lock, User as UserIcon, Phone, MapPin, Building } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateRegistrationForm } from '../../utils/validation';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    gender: 'Female',
    mobile: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();

    const validation = validateRegistrationForm(form);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    await register(
      {
        fullName: form.fullName,
        email: form.email,
        gender: form.gender,
        mobile: form.mobile,
        address: form.address,
        city: form.city,
      },
      form.password
    );
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full justify-between p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-sm mx-auto w-full">
        {/* Navigation Bar */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Create Account
          </span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Intern Registration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in your details to test persistent local storage
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3.5 pb-4">
          <AppInput
            id="reg-fullname"
            label="Full Name"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            error={fieldErrors.fullName}
            icon={<UserIcon className="w-4 h-4" />}
          />

          <AppInput
            id="reg-email"
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={fieldErrors.email}
            icon={<Mail className="w-4 h-4" />}
          />

          {/* Gender Selector */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Gender
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800/80">
              {['Male', 'Female', 'Other', 'Prefer Not'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => updateField('gender', gender)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    form.gender === gender
                      ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
            {fieldErrors.gender && (
              <p className="text-xs text-rose-500 mt-0.5">• {fieldErrors.gender}</p>
            )}
          </div>

          <AppInput
            id="reg-mobile"
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            type="tel"
            value={form.mobile}
            onChange={(e) => updateField('mobile', e.target.value)}
            error={fieldErrors.mobile}
            icon={<Phone className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-2.5">
            <AppInput
              id="reg-city"
              label="City"
              placeholder="San Francisco"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              error={fieldErrors.city}
              icon={<Building className="w-4 h-4" />}
            />
            <AppInput
              id="reg-address"
              label="Address"
              placeholder="123 Main St"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              error={fieldErrors.address}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>

          <AppInput
            id="reg-password"
            label="Password (min 6 chars)"
            placeholder="••••••••"
            isPassword
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            error={fieldErrors.password}
            icon={<Lock className="w-4 h-4" />}
          />

          <AppInput
            id="reg-confirm-password"
            label="Confirm Password"
            placeholder="••••••••"
            isPassword
            value={form.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            error={fieldErrors.confirmPassword}
            icon={<Lock className="w-4 h-4" />}
          />

          <div className="pt-3">
            <AppButton
              id="reg-submit-btn"
              title="Create Account"
              type="submit"
              size="lg"
              isLoading={isLoading}
              icon={<UserPlus className="w-4 h-4" />}
            />
          </div>
        </form>
      </div>

      <div className="text-center pt-3 pb-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
