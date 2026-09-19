import React, { useState } from 'react';
import { Home, Heart, User as UserIcon } from 'lucide-react';
import { HomeScreen } from '../screens/home/HomeScreen';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ImageDetailsScreen } from '../screens/details/ImageDetailsScreen';
import { MainTab, PicsumImage } from '../types';
import { useGalleryStore } from '../store/galleryStore';

export const MainNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedImage, setSelectedImage] = useState<PicsumImage | null>(null);

  const { favorites } = useGalleryStore();

  // If viewing details, render stack screen
  if (selectedImage) {
    return (
      <ImageDetailsScreen
        image={selectedImage}
        onBack={() => setSelectedImage(null)}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Active Tab Screen */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeScreen onSelectImage={(img) => setSelectedImage(img)} />
        )}
        {activeTab === 'favorites' && (
          <FavoritesScreen
            onSelectImage={(img) => setSelectedImage(img)}
            onNavigateToHome={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Bottom Navigation Tab Bar */}
      <div className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 px-6 py-2 flex items-center justify-around z-30">
        {/* Home Tab */}
        <button
          type="button"
          id="tab-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors cursor-pointer select-none ${
            activeTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Favorites Tab */}
        <button
          type="button"
          id="tab-favorites"
          onClick={() => setActiveTab('favorites')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition-colors cursor-pointer select-none ${
            activeTab === 'favorites'
              ? 'text-rose-600 dark:text-rose-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'favorites' ? 'fill-current scale-110' : ''
              }`}
            />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold min-w-[15px] h-[15px] flex items-center justify-center leading-none">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Favorites</span>
        </button>

        {/* Profile Tab */}
        <button
          type="button"
          id="tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors cursor-pointer select-none ${
            activeTab === 'profile'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <UserIcon className={`w-5 h-5 ${activeTab === 'profile' ? 'scale-110' : ''}`} />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>
    </div>
  );
};
