import { create } from 'zustand';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { hashPassword } from '../utils/validation';

const SESSION_KEY = 'user_session';
const REGISTERED_USER_KEY = 'registered_user';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  checkSession: () => Promise<void>;
  register: (userData: Omit<User, 'passwordHash'>, rawPassword: string) => Promise<boolean>;
  login: (email: string, rawPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateCurrentUser: (updatedUser: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const sessionUser = await storageService.getItem<User>(SESSION_KEY);
      if (sessionUser) {
        set({ currentUser: sessionUser, isAuthenticated: true, isLoading: false, error: null });
        return;
      }

      // Check if there is already a registered user for demo convenience
      const registered = await storageService.getItem<User>(REGISTERED_USER_KEY);
      if (!registered) {
        // Seed an initial demo intern user for immediate exploration
        const defaultHash = await hashPassword('password123');
        const demoUser: User = {
          fullName: 'Alex Morgan',
          email: 'alex.intern@example.com',
          gender: 'Female',
          mobile: '+1 (555) 234-5678',
          address: '42 Silicon Avenue, Suite 400',
          city: 'San Francisco',
          passwordHash: defaultHash,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        };
        await storageService.setItem(REGISTERED_USER_KEY, demoUser);
      }
      set({ currentUser: null, isAuthenticated: false, isLoading: false });
    } catch (err) {
      console.error('[authStore] Session check error:', err);
      set({ currentUser: null, isAuthenticated: false, isLoading: false });
    }
  },

  register: async (userData, rawPassword) => {
    set({ isLoading: true, error: null });
    try {
      const passwordHash = await hashPassword(rawPassword);
      const newUser: User = {
        ...userData,
        passwordHash,
        avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      };

      // Save user to storage
      await storageService.setItem(REGISTERED_USER_KEY, newUser);
      await storageService.setItem(SESSION_KEY, newUser);

      set({
        currentUser: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: 'Failed to create account. Please try again.',
      });
      return false;
    }
  },

  login: async (email, rawPassword) => {
    set({ isLoading: true, error: null });
    try {
      const registered = await storageService.getItem<User>(REGISTERED_USER_KEY);
      if (!registered) {
        set({
          isLoading: false,
          error: 'No account registered with this email. Please register first.',
        });
        return false;
      }

      if (registered.email.toLowerCase() !== email.trim().toLowerCase()) {
        set({
          isLoading: false,
          error: 'Invalid credentials. Registered email: ' + registered.email,
        });
        return false;
      }

      const inputHash = await hashPassword(rawPassword);
      if (registered.passwordHash !== inputHash) {
        set({
          isLoading: false,
          error: 'Incorrect password. (Default demo pass is password123)',
        });
        return false;
      }

      await storageService.setItem(SESSION_KEY, registered);
      set({
        currentUser: registered,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: 'An unexpected login error occurred.',
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await storageService.removeItem(SESSION_KEY);
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('[authStore] Logout error:', err);
      set({ isLoading: false });
    }
  },

  updateCurrentUser: async (updatedFields) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const mergedUser: User = { ...currentUser, ...updatedFields };
    await storageService.setItem(SESSION_KEY, mergedUser);
    await storageService.setItem(REGISTERED_USER_KEY, mergedUser);
    set({ currentUser: mergedUser });
  },

  clearError: () => set({ error: null }),
}));
