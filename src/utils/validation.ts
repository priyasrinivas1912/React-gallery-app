import { User, ValidationResult } from '../types';

export async function hashPassword(password: string): Promise<string> {
  // In modern Web Crypto & Expo Crypto (crypto.digestStringAsync)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback hash implementation for environments without subtle crypto
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  // Accepts numbers, spaces, plus, hyphens, min 10 digits
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  return cleanPhone.length >= 10 && /^\+?[0-9]{10,15}$/.test(cleanPhone);
}

export function validateRegistrationForm(form: Partial<User> & { password?: string; confirmPassword?: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!form.fullName || form.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters';
  }

  if (!form.email || !validateEmail(form.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.gender) {
    errors.gender = 'Please select a gender';
  }

  if (!form.mobile || !validatePhone(form.mobile)) {
    errors.mobile = 'Enter a valid 10+ digit mobile number';
  }

  if (!form.address || form.address.trim().length < 5) {
    errors.address = 'Street address must be at least 5 characters';
  }

  if (!form.city || form.city.trim().length < 2) {
    errors.city = 'City name is required';
  }

  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (form.confirmPassword !== undefined && form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(email: string, password?: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid registered email';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileUpdate(user: Partial<User>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!user.fullName || user.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters';
  }

  if (!user.email || !validateEmail(user.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!user.mobile || !validatePhone(user.mobile)) {
    errors.mobile = 'Enter a valid 10+ digit mobile number';
  }

  if (!user.address || user.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters';
  }

  if (!user.city || user.city.trim().length < 2) {
    errors.city = 'City name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
