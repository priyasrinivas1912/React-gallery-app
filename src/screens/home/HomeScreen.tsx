import React, { useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal, RefreshCw, Sparkles, Filter, Image as ImageIcon } from 'lucide-react';
import { useGalleryStore } from '../../store/galleryStore';
import { useAuthStore } from '../../store/authStore';
import { useDebounce } from '../../hooks/useDebounce';
import { ImageCard } from '../../components/ImageCard';
import { LoadingView } from '../../components/LoadingView';
import { ErrorView } from '../../components/ErrorView';
import { AuthorFilter, PicsumImage } from '../../types';

interface HomeScreenProps {
  onSelectImage: (image: PicsumImage) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectImage }) => {
  const { currentUser } = useAuthStore();
  const {
    images,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    error,
    searchQuery,
    authorFilter,
    favoriteIds,
    fetchImages,
    loadMore,
    refresh,
    setSearchQuery,
    setDebouncedSearchQuery,
    setAuthorFilter,
    toggleFavorite,
    getFilteredImages,
  } = useGalleryStore();

  // Debounce search input
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setDebouncedSearchQuery(debouncedQuery);
  }, [debouncedQuery, setDebouncedSearchQuery]);

  const filteredImages = getFilteredImages();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll listener to emulate FlatList onEndReached
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 200) {
      if (!isLoadingMore && hasMore && !searchQuery) {
        loadMore();
      }
    }
  };

  const filterOptions: { label: string; value: AuthorFilter }[] = [
    { label: 'All Photos', value: 'all' },
    { label: 'Authors A–M', value: 'A-M' },
    { label: 'Authors N–Z', value: 'N-Z' },
  ];

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex flex-col flex-1 h-full w-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
    >
      {/* Top Mobile App Header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Picsum Photos Feed
            </span>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Explore Gallery
            </h1>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            title="Refresh feed"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center mb-2.5">
          <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="home-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search authors (e.g. Alejandro, Dan)..."
            className="w-full text-xs rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 py-2.5 pl-9 pr-8 outline-none text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips: All, A–M, N–Z */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 pr-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Author:</span>
          </div>
          {filterOptions.map((opt) => {
            const isSelected = authorFilter === opt.value;
            return (
              <button
                key={opt.value}
                id={`filter-${opt.value.toLowerCase()}`}
                type="button"
                onClick={() => setAuthorFilter(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1">
        {/* Active Filter Indicators */}
        {(searchQuery || authorFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
            <span>
              Showing {filteredImages.length} results
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setAuthorFilter('all');
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Initial Loading View */}
        {isLoading && images.length === 0 ? (
          <LoadingView
            fullScreen
            message="Connecting to Picsum API..."
            subtext="Loading high-resolution photography feed"
          />
        ) : error && images.length === 0 ? (
          <ErrorView
            fullScreen
            title="Failed to Load Picsum Feed"
            message={error}
            onRetry={refresh}
          />
        ) : filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <ImageIcon className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
              No matching images
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Try adjusting your search keywords or switching the author filter range.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setAuthorFilter('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-xl"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <>
            {/* FlatList Equivalent: Grid of Image Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {filteredImages.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  isFavorite={favoriteIds.includes(image.id)}
                  onPress={onSelectImage}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* Pagination / Loading More Footer */}
            {isLoadingMore && (
              <div className="py-6 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Loading more photos...</span>
              </div>
            )}

            {!hasMore && !searchQuery && images.length > 0 && (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-600">
                You've reached the end of the gallery.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
