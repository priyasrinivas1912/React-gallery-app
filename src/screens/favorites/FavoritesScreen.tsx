import React, { useState } from 'react';
import { Heart, Search, X, Sparkles, ImageOff } from 'lucide-react';
import { useGalleryStore } from '../../store/galleryStore';
import { ImageCard } from '../../components/ImageCard';
import { AuthorFilter, PicsumImage } from '../../types';

interface FavoritesScreenProps {
  onSelectImage: (image: PicsumImage) => void;
  onNavigateToHome: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onSelectImage,
  onNavigateToHome,
}) => {
  const {
    favorites,
    favoriteIds,
    toggleFavorite,
  } = useGalleryStore();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AuthorFilter>('all');

  const filteredFavorites = favorites.filter((img) => {
    if (search.trim()) {
      if (!img.author.toLowerCase().includes(search.trim().toLowerCase())) {
        return false;
      }
    }
    if (filter === 'all') return true;
    const firstLetter = img.author.trim().charAt(0).toUpperCase();
    if (filter === 'A-M') return firstLetter >= 'A' && firstLetter <= 'M';
    if (filter === 'N-Z') return firstLetter >= 'N' && firstLetter <= 'Z';
    return true;
  });

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Mobile App Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">
              AsyncStorage Persistence
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Favorite Photos
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                {favorites.length}
              </span>
            </div>
          </div>
        </div>

        {/* Search inside favorites */}
        {favorites.length > 0 && (
          <div className="relative flex items-center mb-2">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in your favorites..."
              className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-transparent focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 py-2.5 pl-9 pr-8 outline-none text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 p-1 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Author filter chips */}
        {favorites.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(['all', 'A-M', 'N-Z'] as AuthorFilter[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilter(opt)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
                  filter === opt
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt === 'all' ? 'All' : opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-4 text-rose-500">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Favorites Saved Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
              Tap the heart icon on any photo in the gallery to bookmark it. Your favorites persist locally across app launches.
            </p>
            <button
              id="btn-explore-favorites-empty"
              type="button"
              onClick={onNavigateToHome}
              className="mt-6 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              Discover Photos
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <ImageOff className="w-10 h-10 text-slate-400 mb-2" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching favorites found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try modifying your search or author filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredFavorites.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                isFavorite={favoriteIds.includes(image.id)}
                onPress={onSelectImage}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
