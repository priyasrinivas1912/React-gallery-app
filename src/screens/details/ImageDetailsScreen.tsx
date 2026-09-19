import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Download,
  Share2,
  ExternalLink,
  Info,
  Maximize2,
  Check,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { PicsumImage } from '../../types';
import { useGalleryStore } from '../../store/galleryStore';
import { AppButton } from '../../components/AppButton';

interface ImageDetailsScreenProps {
  image: PicsumImage;
  onBack: () => void;
}

export const ImageDetailsScreen: React.FC<ImageDetailsScreenProps> = ({
  image,
  onBack,
}) => {
  const { favoriteIds, toggleFavorite } = useGalleryStore();
  const isFav = favoriteIds.includes(image.id);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Full-size resolution URL
  const highResUrl = image.download_url;

  // Handle Download (simulating Expo Media Library requestPermissionsAsync & saveToLibraryAsync, + downloading real file)
  const handleDownload = async () => {
    setIsDownloading(true);
    setShowPermissionBanner(true);

    try {
      // Fetch image as blob
      const response = await fetch(image.download_url);
      const blob = await response.blob();

      // Trigger browser download of image
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `picsum-${image.id}-${image.author.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.warn('Direct blob download restricted by CORS, opening in new tab fallback', err);
      // Fallback: trigger direct anchor download
      const a = document.createElement('a');
      a.href = image.download_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Share (simulating Expo Sharing / React Native Share)
  const handleShare = async () => {
    const shareData = {
      title: `Photo by ${image.author}`,
      text: `Check out this photograph by ${image.author} on Picsum Photos!`,
      url: image.url || image.download_url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (e) {
        // User cancelled share
      }
    } else {
      // Fallback: Copy URL to clipboard
      await navigator.clipboard.writeText(image.download_url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          id="btn-details-back"
          className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-semibold">Back</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Image #{image.id}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            id="btn-details-share"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="Share image"
          >
            {shareSuccess ? (
              <Check className="w-5 h-5 text-emerald-500 animate-scale" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(image)}
            id="btn-details-favorite"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isFav
                ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {shareSuccess && (
        <div className="mx-4 mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Permission & Media Library Simulation Banner */}
      {showPermissionBanner && downloadSuccess && (
        <div className="mx-4 mt-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Expo Media Library: Saved to Gallery</p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Permissions granted (`CAMERA_ROLL`). Full-resolution JPEG file downloaded to your device storage.
            </p>
          </div>
        </div>
      )}

      <div className="p-4 flex flex-col gap-4">
        {/* Main High-Resolution Photo Container */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          {!isImageLoaded && (
            <div className="aspect-[4/3] w-full flex items-center justify-center bg-slate-800 animate-pulse">
              <Sparkles className="w-6 h-6 text-slate-500 animate-spin" />
            </div>
          )}

          <img
            src={highResUrl}
            alt={`Full photo by ${image.author}`}
            referrerPolicy="no-referrer"
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full max-h-[380px] object-contain transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0 h-0'
            }`}
          />

          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3" />
            <span>
              {image.width} × {image.height}
            </span>
          </div>
        </div>

        {/* Action Controls: Download & Favorite */}
        <div className="grid grid-cols-2 gap-3">
          <AppButton
            id="btn-download-image"
            title={downloadSuccess ? 'Downloaded!' : 'Save to Gallery'}
            variant="primary"
            size="md"
            isLoading={isDownloading}
            icon={downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            onClick={handleDownload}
          />

          <AppButton
            id="btn-toggle-favorite-details"
            title={isFav ? 'In Favorites' : 'Add to Favs'}
            variant={isFav ? 'secondary' : 'outline'}
            size="md"
            icon={<Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : ''}`} />}
            onClick={() => toggleFavorite(image)}
          />
        </div>

        {/* Information & Specifications Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Image Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Author</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {image.author}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Picsum ID</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                #{image.id}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Resolution</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {image.width} × {image.height} px
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Aspect Ratio</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {(image.width / image.height).toFixed(2)} : 1
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between py-1"
            >
              <span>View original photo on Unsplash</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={image.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-between py-1"
            >
              <span>Direct Picsum CDN API link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
