import React, { useState } from 'react';
import { LogIn, Sparkles, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { validateLoginForm } from '../../utils/validation';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('alex.intern@example.com');
  const [password, setPassword] = useState('password123');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    await login(email, password);
  };

  const handleFillDemo = () => {
    setEmail('alex.intern@example.com');
    setPassword('password123');
    setFieldErrors({});
    clearError();
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full justify-between p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-sm mx-auto w-full pt-4">
        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Picsum Gallery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            React Native + TypeScript Assignment
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <AppInput
            id="login-email"
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
            }}
            error={fieldErrors.email}
            icon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <AppInput
            id="login-password"
            label="Password"
            placeholder="••••••••"
            isPassword
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
            }}
            error={fieldErrors.password}
            icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
          />

          <div className="pt-2">
            <AppButton
              id="login-submit-btn"
              title="Sign In"
              type="submit"
              size="lg"
              isLoading={isLoading}
              icon={<LogIn className="w-4 h-4" />}
            />
          </div>
        </form>

        {/* Demo Fast-Fill helper pill */}
        <div className="mt-5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-[11px] text-blue-900 dark:text-blue-200">
              Demo account pre-configured
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Auto Fill
          </button>
        </div>
      </div>

      {/* Footer Switch to Register */}
      <div className="mt-8 text-center pb-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <button
            id="btn-switch-register"
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};
