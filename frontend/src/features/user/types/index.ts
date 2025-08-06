export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'artist' | 'buyer';
  avatar?: string;
  bio?: string;
  joinedAt: string;
  lastActivity?: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showEmail: boolean;
    showActivity: boolean;
  };
}

export interface UserStats {
  // Para artistas
  songsPublished?: number;
  licensesSold?: number;
  totalEarnings?: number;
  
  // Para compradores
  licensesPurchased?: number;
  totalSpent?: number;
  favoriteGenres?: string[];
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateProfileResponse {
  user: UserProfile;
  success: boolean;
  message: string;
}
