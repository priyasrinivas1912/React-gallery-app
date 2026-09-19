import { create } from 'zustand';
import { storageService } from '../services/storageService';

const DARK_MODE_KEY = 'pref_dark_mode';
const DEVICE_SKIN_KEY = 'pref_device_skin';

export type DeviceSkin = 'iphone' | 'android' | 'fullscreen';

interface ProfileState {
  isDarkMode: boolean;
  deviceSkin: DeviceSkin;
  showInspector: boolean;
  activeInspectorTab: 'checklist' | 'code' | 'architecture' | 'tests';
  activeCodeFile: string;

  toggleDarkMode: () => void;
  setDeviceSkin: (skin: DeviceSkin) => void;
  setShowInspector: (show: boolean) => void;
  setActiveInspectorTab: (tab: 'checklist' | 'code' | 'architecture' | 'tests') => void;
  setActiveCodeFile: (file: string) => void;
  initializePreferences: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  isDarkMode: false,
  deviceSkin: 'iphone',
  showInspector: false,
  activeInspectorTab: 'checklist',
  activeCodeFile: 'src/screens/home/HomeScreen.tsx',

  initializePreferences: async () => {
    try {
      const storedDarkMode = await storageService.getItem<boolean>(DARK_MODE_KEY);
      if (storedDarkMode !== null) {
        set({ isDarkMode: storedDarkMode });
        if (storedDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const storedSkin = await storageService.getItem<DeviceSkin>(DEVICE_SKIN_KEY);
      if (storedSkin) {
        set({ deviceSkin: storedSkin });
      }
    } catch (e) {
      console.warn('Could not initialize preferences', e);
    }
  },

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    storageService.setItem(DARK_MODE_KEY, next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setDeviceSkin: (skin: DeviceSkin) => {
    set({ deviceSkin: skin });
    storageService.setItem(DEVICE_SKIN_KEY, skin);
  },

  setShowInspector: (show: boolean) => {
    set({ showInspector: show });
  },

  setActiveInspectorTab: (tab) => {
    set({ activeInspectorTab: tab });
  },

  setActiveCodeFile: (file) => {
    set({ activeCodeFile: file });
  },
}));
