import { UserProfile, UpdateProfileRequest, UpdateProfileResponse } from '../types';

// Mock data para perfiles de usuario
const mockUserProfiles: { [userId: string]: UserProfile } = {
  'user_artist_1': {
    id: 'user_artist_1',
    name: 'Elena Rodriguez',
    email: 'elena@music.com',
    role: 'artist',
    avatar: '🎤',
    bio: 'Artista independiente especializada en música electrónica y ambient. Me encanta crear paisajes sonoros que transporten a otros mundos.',
    joinedAt: '2024-01-15T10:30:00Z',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    preferences: {
      theme: 'dark',
      language: 'es',
      notifications: {
        email: true,
        push: true,
        marketing: false
      },
      privacy: {
        showEmail: false,
        showActivity: true
      }
    },
    stats: {
      songsPublished: 12,
      licensesSold: 45,
      totalEarnings: 2850.50
    }
  },
  'user_artist_2': {
    id: 'user_artist_2',
    name: 'DJ Mike Flow',
    email: 'mike@beats.com',
    role: 'artist',
    avatar: '🎧',
    bio: 'Producer de hip-hop y beats urbanos. Fusiono sonidos clásicos con elementos modernos para crear ritmos únicos.',
    joinedAt: '2024-02-20T14:15:00Z',
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    preferences: {
      theme: 'light',
      language: 'es',
      notifications: {
        email: true,
        push: false,
        marketing: true
      },
      privacy: {
        showEmail: true,
        showActivity: true
      }
    },
    stats: {
      songsPublished: 28,
      licensesSold: 87,
      totalEarnings: 5420.75
    }
  },
  'user_buyer_1': {
    id: 'user_buyer_1',
    name: 'Carlos Martinez',
    email: 'carlos@company.com',
    role: 'buyer',
    avatar: '👨‍💼',
    bio: 'Director creativo en agencia de marketing. Siempre en busca de música perfecta para campañas publicitarias y contenido digital.',
    joinedAt: '2024-03-10T09:45:00Z',
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    preferences: {
      theme: 'auto',
      language: 'es',
      notifications: {
        email: true,
        push: true,
        marketing: false
      },
      privacy: {
        showEmail: false,
        showActivity: false
      }
    },
    stats: {
      licensesPurchased: 23,
      totalSpent: 1890.25,
      favoriteGenres: ['electronic', 'pop', 'jazz']
    }
  },
  'user_buyer_2': {
    id: 'user_buyer_2',
    name: 'Sofia Chen',
    email: 'sofia@media.com',
    role: 'buyer',
    avatar: '👩‍💻',
    bio: 'Productora de contenido digital y podcasts. Me apasiona encontrar música que complemente perfectamente las historias que contamos.',
    joinedAt: '2024-04-05T16:20:00Z',
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: false,
        push: true,
        marketing: false
      },
      privacy: {
        showEmail: true,
        showActivity: true
      }
    },
    stats: {
      licensesPurchased: 34,
      totalSpent: 2670.80,
      favoriteGenres: ['folk', 'acoustic', 'classical']
    }
  }
};

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API mock para perfil de usuario
export const userProfileApi = {
  // GET /user/profile - Obtener perfil del usuario actual
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    await delay(600);
    
    const profile = mockUserProfiles[userId];
    if (!profile) {
      throw new Error('Usuario no encontrado');
    }
    
    return profile;
  },

  // PUT /user/profile - Actualizar perfil del usuario
  updateUserProfile: async (userId: string, request: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    await delay(800);
    
    const currentProfile = mockUserProfiles[userId];
    if (!currentProfile) {
      throw new Error('Usuario no encontrado');
    }

    // Actualizar perfil
    const currentPreferences = currentProfile.preferences || {
      theme: 'auto' as const,
      language: 'es' as const,
      notifications: { email: true, push: true, marketing: false },
      privacy: { showEmail: false, showActivity: true }
    };

    const updatedProfile: UserProfile = {
      ...currentProfile,
      name: request.name ?? currentProfile.name,
      bio: request.bio ?? currentProfile.bio,
      avatar: request.avatar ?? currentProfile.avatar,
      preferences: request.preferences 
        ? { 
            theme: request.preferences.theme ?? currentPreferences.theme,
            language: request.preferences.language ?? currentPreferences.language,
            notifications: request.preferences.notifications 
              ? { ...currentPreferences.notifications, ...request.preferences.notifications }
              : currentPreferences.notifications,
            privacy: request.preferences.privacy
              ? { ...currentPreferences.privacy, ...request.preferences.privacy }
              : currentPreferences.privacy
          }
        : currentPreferences
    };

    // Guardar en mock
    mockUserProfiles[userId] = updatedProfile;

    return {
      user: updatedProfile,
      success: true,
      message: 'Perfil actualizado correctamente'
    };
  },

  // GET /user/stats - Obtener estadísticas del usuario
  getUserStats: async (userId: string): Promise<UserProfile['stats']> => {
    await delay(400);
    
    const profile = mockUserProfiles[userId];
    if (!profile) {
      throw new Error('Usuario no encontrado');
    }
    
    return profile.stats;
  },

  // POST /user/avatar - Subir avatar (simulado)
  uploadAvatar: async (userId: string, avatarEmoji: string): Promise<{ avatarUrl: string; success: boolean }> => {
    await delay(1000);
    
    const profile = mockUserProfiles[userId];
    if (!profile) {
      throw new Error('Usuario no encontrado');
    }

    // Simular upload - en realidad solo cambiar emoji
    profile.avatar = avatarEmoji;

    return {
      avatarUrl: avatarEmoji,
      success: true
    };
  }
};
