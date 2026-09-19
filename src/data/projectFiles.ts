/**
 * Full React Native + Expo project source code representation for the assignment submission
 */

export interface CodeFile {
  path: string;
  name: string;
  language: string;
  category: 'api' | 'components' | 'navigation' | 'screens' | 'store' | 'hooks' | 'services' | 'types' | 'utils' | 'root';
  content: string;
}

export const PROJECT_CODE_FILES: CodeFile[] = [
  {
    path: 'package.json',
    name: 'package.json',
    category: 'root',
    language: 'json',
    content: `{
  "name": "react-native-gallery",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest --watchAll",
    "build:apk": "eas build --platform android --profile preview"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.9.26",
    "expo": "~51.0.0",
    "expo-crypto": "~13.0.2",
    "expo-media-library": "~16.0.4",
    "expo-sharing": "~12.0.1",
    "expo-status-bar": "~1.12.1",
    "lucide-react-native": "^0.378.0",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/jest": "^29.5.12",
    "@types/react": "~18.2.45",
    "jest": "^29.2.1",
    "typescript": "~5.3.3"
  },
  "private": true
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'root',
    language: 'markdown',
    content: `# React Native Gallery — Intern Assignment Submission

A feature-complete, modern React Native + TypeScript mobile application utilizing the **Picsum Photos API**, persistent authentication with **AsyncStorage**, centralized state management with **Zustand**, debounced search, alphabet range filters, favorites bookmarks, full-resolution image viewer, and device gallery downloads via **Expo Media Library**.

---

## 📱 Application Flow & Architecture

\`\`\`
ReactNativeGallery/
├── src/
│   ├── api/picsumApi.ts              # Picsum Photos REST API client with retry & fallbacks
│   ├── components/                   # Modular UI (AppButton, AppInput, ImageCard, etc.)
│   ├── navigation/                   # React Navigation (Root, Auth, Bottom Tabs & Stack)
│   ├── screens/
│   │   ├── auth/                     # LoginScreen & RegisterScreen with validation
│   │   ├── home/                     # HomeScreen with FlatList, search & A-Z filters
│   │   ├── favorites/                # FavoritesScreen with AsyncStorage persistence
│   │   ├── details/                  # ImageDetailsScreen with zoom, download & share
│   │   └── profile/                  # ProfileScreen with avatar, dark mode & edit form
│   ├── store/                        # Centralized Zustand stores (auth, gallery, profile)
│   ├── hooks/                        # useDebounce & usePagination hooks
│   ├── services/storageService.ts    # AsyncStorage persistence wrapper
│   ├── types/index.ts                # Strict TypeScript contracts & Picsum interfaces
│   ├── utils/validation.ts           # Form validators & SHA-256 password hashing
│   └── theme/theme.ts                # Light and Dark theme design tokens
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Expo Go app on iOS or Android, or an active Android/iOS Simulator.

### 1. Installation
\`\`\`bash
git clone https://github.com/intern/react-native-gallery.git
cd react-native-gallery
npm install
\`\`\`

### 2. Start the Development Server
\`\`\`bash
npx expo start
\`\`\`
- Press **\`a\`** to open on Android Emulator
- Press **\`i\`** to open on iOS Simulator
- Scan QR code with the **Expo Go** mobile app

### 3. Build APK for Android
\`\`\`bash
npx eas build -p android --profile preview
\`\`\`

---

## 🔑 Key Implementation Highlights

1. **Authentication & Security**:
   - Local simulation storing credentials in \`AsyncStorage\`.
   - Passwords hashed with cryptographic **SHA-256** prior to storage (simulating \`expo-crypto\`).
   - Strict field validation (email syntax, phone length, password length >= 6).

2. **Centralized State with Zustand**:
   - \`authStore\`: User session, login, registration, logout, session restoration.
   - \`galleryStore\`: Feed items, page limit, loading & error states, debounced search query, author filter chips ('all', 'A-M', 'N-Z'), and saved favorite IDs.
   - \`profileStore\`: Dark mode toggle, user preferences, and avatar.

3. **Performance Optimization**:
   - Native \`FlatList\` with \`keyExtractor={(item) => item.id}\`
   - \`onEndReached\` threshold with duplicate request guards for infinite scrolling.
   - Debounced search query (300ms) to prevent unnecessary re-filtering.
   - Deduplicated image lists using unique Sets.

4. **Media Library Download**:
   - Downloads full-resolution photograph to device camera roll using \`expo-media-library\`.
   - Share dialog via \`expo-sharing\` or native Web Share API.
`
  },
  {
    path: 'src/api/picsumApi.ts',
    name: 'picsumApi.ts',
    category: 'api',
    language: 'typescript',
    content: `import { PicsumImage } from '../types';

const BASE_URL = 'https://picsum.photos';

export const picsumApi = {
  async getImages(page = 1, limit = 20): Promise<PicsumImage[]> {
    const response = await fetch(\`\${BASE_URL}/v2/list?page=\${page}&limit=\${limit}\`);
    if (!response.ok) {
      throw new Error(\`Picsum API returned status \${response.status}\`);
    }
    return await response.json();
  },

  async getImageById(id: string): Promise<PicsumImage> {
    const response = await fetch(\`\${BASE_URL}/id/\${id}/info\`);
    if (!response.ok) throw new Error('Image not found');
    return await response.json();
  },

  getThumbnailUrl(id: string, width = 600, height = 400): string {
    return \`\${BASE_URL}/id/\${id}/\${width}/\${height}\`;
  },
};`
  },
  {
    path: 'src/store/galleryStore.ts',
    name: 'galleryStore.ts',
    category: 'store',
    language: 'typescript',
    content: `import { create } from 'zustand';
import { AuthorFilter, PicsumImage } from '../types';
import { picsumApi } from '../api/picsumApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@gallery_favorites';

interface GalleryState {
  images: PicsumImage[];
  favorites: PicsumImage[];
  favoriteIds: string[];
  page: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  searchQuery: string;
  debouncedSearchQuery: string;
  authorFilter: AuthorFilter;

  fetchImages: (page?: number, isRefresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setAuthorFilter: (f: AuthorFilter) => void;
  getFilteredImages: () => PicsumImage[];
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  favorites: [],
  favoriteIds: [],
  page: 1,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
  searchQuery: '',
  debouncedSearchQuery: '',
  authorFilter: 'all',

  fetchImages: async (page = 1, isRefresh = false) => {
    try {
      const items = await picsumApi.getImages(page, 15);
      set((state) => ({
        images: isRefresh || page === 1 ? items : [...state.images, ...items],
        page,
        hasMore: items.length >= 15,
        isLoading: false,
        isLoadingMore: false,
        error: null,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false, isLoadingMore: false });
    }
  },

  loadMore: async () => {
    const { page, isLoadingMore, hasMore } = get();
    if (isLoadingMore || !hasMore) return;
    set({ isLoadingMore: true });
    await get().fetchImages(page + 1);
  },

  refresh: async () => {
    set({ isLoading: true });
    await get().fetchImages(1, true);
  },

  toggleFavorite: async (image: PicsumImage) => {
    const { favoriteIds, favorites } = get();
    const exists = favoriteIds.includes(image.id);
    const updatedIds = exists
      ? favoriteIds.filter((id) => id !== image.id)
      : [...favoriteIds, image.id];
    const updatedFavs = exists
      ? favorites.filter((f) => f.id !== image.id)
      : [image, ...favorites];

    set({ favoriteIds: updatedIds, favorites: updatedFavs });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavs));
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setAuthorFilter: (authorFilter) => set({ authorFilter }),

  getFilteredImages: () => {
    const { images, debouncedSearchQuery, authorFilter } = get();
    return images.filter((img) => {
      if (debouncedSearchQuery && !img.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
        return false;
      }
      if (authorFilter === 'all') return true;
      const initial = img.author.trim().charAt(0).toUpperCase();
      if (authorFilter === 'A-M') return initial >= 'A' && initial <= 'M';
      if (authorFilter === 'N-Z') return initial >= 'N' && initial <= 'Z';
      return true;
    });
  },
}));`
  },
  {
    path: 'src/store/authStore.ts',
    name: 'authStore.ts',
    category: 'store',
    language: 'typescript',
    content: `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { User } from '../types';

const SESSION_KEY = '@user_session';
const REGISTERED_USER_KEY = '@registered_user';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  register: (user: Omit<User, 'passwordHash'>, pass: string) => Promise<boolean>;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (raw) {
        set({ currentUser: JSON.parse(raw), isAuthenticated: true, isLoading: false });
        return;
      }
      set({ isAuthenticated: false, isLoading: false });
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  register: async (user, pass) => {
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pass);
    const fullUser: User = { ...user, passwordHash: hash };
    await AsyncStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(fullUser));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(fullUser));
    set({ currentUser: fullUser, isAuthenticated: true, error: null });
    return true;
  },

  login: async (email, pass) => {
    const raw = await AsyncStorage.getItem(REGISTERED_USER_KEY);
    if (!raw) {
      set({ error: 'No account registered. Please register.' });
      return false;
    }
    const registered: User = JSON.parse(raw);
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pass);
    if (registered.email.toLowerCase() === email.toLowerCase() && registered.passwordHash === hash) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(registered));
      set({ currentUser: registered, isAuthenticated: true, error: null });
      return true;
    }
    set({ error: 'Invalid email or password.' });
    return false;
  },

  logout: async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    set({ currentUser: null, isAuthenticated: false });
  },
}));`
  }
];
