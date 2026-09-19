import React, { useState } from 'react';
import { Heart, Sparkles, User as UserIcon } from 'lucide-react';
import { PicsumImage } from '../types';
import { picsumApi } from '../api/picsumApi';

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: (image: PicsumImage) => void;
  onToggleFavorite: (image: PicsumImage) => void;
  variant?: 'grid' | 'large';
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  isFavorite,
  onPress,
  onToggleFavorite,
  variant = 'grid',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Optimized thumbnail
  const thumbUrl = picsumApi.getThumbnailUrl(image.id, variant === 'large' ? 800 : 500, variant === 'large' ? 533 : 360);

  return (
    <div
      id={`image-card-${image.id}`}
      onClick={() => onPress(image)}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* Skeleton while loading */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-400 dark:text-slate-600 animate-spin" />
          </div>
        )}

        <img
          src={hasError ? image.download_url : thumbUrl}
          alt={`Photo by ${image.author}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (!hasError) setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Favorite Button Overlay */}
        <button
          id={`fav-btn-${image.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(image);
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-150 active:scale-90 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-black/35 hover:bg-black/50 text-white/90'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`}
          />
        </button>

        {/* Dimension pill */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-medium text-white/90">
          #{image.id}
        </div>
      </div>

      {/* Info footer */}
      <div className="p-3 flex items-center justify-between gap-2 bg-white dark:bg-slate-900">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {image.author}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {image.width} × {image.height} px
          </p>
        </div>
      </div>
    </div>
  );
};
