/**
 * AsyncStorage simulation service
 * Emulates @react-native-async-storage/async-storage for Web and Local execution
 */

const STORAGE_PREFIX = '@ReactNativeGallery:';

export const storageService = {
  async getItem<T = string>(key: string): Promise<T | null> {
    try {
      const rawValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (rawValue === null) return null;
      try {
        return JSON.parse(rawValue) as T;
      } catch {
        return rawValue as unknown as T;
      }
    } catch (error) {
      console.error(`[StorageService] Error reading key: ${key}`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
    } catch (error) {
      console.error(`[StorageService] Error writing key: ${key}`, error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`[StorageService] Error removing key: ${key}`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (error) {
      console.error('[StorageService] Error clearing storage', error);
    }
  },
};
