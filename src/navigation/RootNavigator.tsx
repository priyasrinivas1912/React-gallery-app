import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGalleryStore } from '../store/galleryStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { Sparkles, Loader2 } from 'lucide-react';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const { initializeGallery } = useGalleryStore();

  useEffect(() => {
    const initApp = async () => {
      await checkSession();
      await initializeGallery();
    };
    initApp();
  }, [checkSession, initializeGallery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900 text-white p-8 select-none">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 mb-4 animate-bounce">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black tracking-tight">Picsum Gallery</h2>
        <p className="text-xs text-slate-400 mt-1">Restoring AsyncStorage session...</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-blue-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Mounting Zustand Stores</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};
