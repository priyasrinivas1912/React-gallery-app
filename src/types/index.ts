export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface User {
  fullName: string;
  email: string;
  gender: string;
  mobile: string;
  address: string;
  city: string;
  passwordHash: string;
  avatarUrl?: string;
}

export type AuthorFilter = 'all' | 'A-M' | 'N-Z';

export type MainTab = 'home' | 'favorites' | 'profile';

export type ScreenName = 
  | 'login'
  | 'register'
  | 'main'
  | 'details';

export interface NavigationState {
  currentScreen: ScreenName;
  activeTab: MainTab;
  selectedImage: PicsumImage | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface AssignmentCheckItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category: 'auth' | 'gallery' | 'details' | 'profile' | 'delivery';
}
