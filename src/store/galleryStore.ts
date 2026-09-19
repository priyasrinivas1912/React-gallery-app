import { create } from 'zustand';
import { AuthorFilter, PicsumImage } from '../types';
import { picsumApi } from '../api/picsumApi';
import { storageService } from '../services/storageService';

const FAVORITES_KEY = 'gallery_favorite_images';
const FAVORITE_IDS_KEY = 'gallery_favorite_ids';

interface GalleryState {
  images: PicsumImage[];
  favorites: PicsumImage[];
  favoriteIds: string[];
  page: number;
  limit: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  searchQuery: string;
  debouncedSearchQuery: string;
  authorFilter: AuthorFilter;

  // Actions
  initializeGallery: () => Promise<void>;
  fetchImages: (page?: number, isRefresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setDebouncedSearchQuery: (query: string) => void;
  setAuthorFilter: (filter: AuthorFilter) => void;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  isFavorite: (imageId: string) => boolean;
  getFilteredImages: () => PicsumImage[];
  getFilteredFavorites: () => PicsumImage[];
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  favorites: [],
  favoriteIds: [],
  page: 1,
  limit: 15,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
  searchQuery: '',
  debouncedSearchQuery: '',
  authorFilter: 'all',

  initializeGallery: async () => {
    // Load favorites from AsyncStorage
    try {
      const storedIds = await storageService.getItem<string[]>(FAVORITE_IDS_KEY) || [];
      const storedFavorites = await storageService.getItem<PicsumImage[]>(FAVORITES_KEY) || [];
      set({ favoriteIds: storedIds, favorites: storedFavorites });
    } catch (e) {
      console.warn('Failed to load favorites', e);
    }

    // Load initial images if empty
    if (get().images.length === 0) {
      await get().fetchImages(1, false);
    }
  },

  fetchImages: async (page = 1, isRefresh = false) => {
    const { limit, images } = get();

    if (isRefresh) {
      set({ isRefreshing: true, error: null });
    } else if (page === 1) {
      set({ isLoading: true, error: null });
    } else {
      set({ isLoadingMore: true, error: null });
    }

    try {
      const newItems = await picsumApi.getImages(page, limit);

      if (isRefresh || page === 1) {
        set({
          images: newItems,
          page: 1,
          hasMore: newItems.length >= limit,
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
          error: null,
        });
      } else {
        // Deduplicate incoming images by ID
        const existingIds = new Set(images.map((img) => img.id));
        const filteredNew = newItems.filter((img) => !existingIds.has(img.id));

        set({
          images: [...images, ...filteredNew],
          page,
          hasMore: newItems.length >= limit,
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
          error: null,
        });
      }
    } catch (err: any) {
      set({
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
        error: err.message || 'Failed to fetch gallery images. Please check connection.',
      });
    }
  },

  loadMore: async () => {
    const { page, isLoading, isLoadingMore, isRefreshing, hasMore } = get();
    if (isLoading || isLoadingMore || isRefreshing || !hasMore) return;

    await get().fetchImages(page + 1, false);
  },

  refresh: async () => {
    await get().fetchImages(1, true);
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setDebouncedSearchQuery: (query: string) => {
    set({ debouncedSearchQuery: query });
  },

  setAuthorFilter: (filter: AuthorFilter) => {
    set({ authorFilter: filter });
  },

  toggleFavorite: async (image: PicsumImage) => {
    const { favoriteIds, favorites } = get();
    const isCurrentlyFav = favoriteIds.includes(image.id);

    let updatedIds: string[];
    let updatedFavorites: PicsumImage[];

    if (isCurrentlyFav) {
      updatedIds = favoriteIds.filter((id) => id !== image.id);
      updatedFavorites = favorites.filter((fav) => fav.id !== image.id);
    } else {
      updatedIds = [...favoriteIds, image.id];
      updatedFavorites = [image, ...favorites];
    }

    set({ favoriteIds: updatedIds, favorites: updatedFavorites });

    // Persist to storage
    await storageService.setItem(FAVORITE_IDS_KEY, updatedIds);
    await storageService.setItem(FAVORITES_KEY, updatedFavorites);
  },

  isFavorite: (imageId: string) => {
    return get().favoriteIds.includes(imageId);
  },

  getFilteredImages: () => {
    const { images, debouncedSearchQuery, authorFilter } = get();

    return images.filter((img) => {
      // 1. Author search filter
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.trim().toLowerCase();
        if (!img.author.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Alphabetical range filter (All, A–M, N–Z)
      if (authorFilter === 'all') return true;

      const firstLetter = img.author.trim().charAt(0).toUpperCase();
      if (authorFilter === 'A-M') {
        return firstLetter >= 'A' && firstLetter <= 'M';
      }
      if (authorFilter === 'N-Z') {
        return firstLetter >= 'N' && firstLetter <= 'Z';
      }

      return true;
    });
  },

  getFilteredFavorites: () => {
    const { favorites, debouncedSearchQuery, authorFilter } = get();

    return favorites.filter((img) => {
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.trim().toLowerCase();
        if (!img.author.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (authorFilter === 'all') return true;

      const firstLetter = img.author.trim().charAt(0).toUpperCase();
      if (authorFilter === 'A-M') {
        return firstLetter >= 'A' && firstLetter <= 'M';
      }
      if (authorFilter === 'N-Z') {
        return firstLetter >= 'N' && firstLetter <= 'Z';
      }

      return true;
    });
  },
}));
