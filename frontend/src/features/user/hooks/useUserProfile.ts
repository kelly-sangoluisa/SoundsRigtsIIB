import { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest } from '../types';
import { userProfileApi } from '../api/userProfileApi';

// Hook para obtener el perfil del usuario actual
export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await userProfileApi.getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const refetch = () => {
    if (userId) {
      fetchProfile();
    }
  };

  return {
    profile,
    loading,
    error,
    refetch
  };
};

// Hook para actualizar el perfil del usuario
export const useUpdateProfile = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, request: UpdateProfileRequest) => {
    try {
      setUpdating(true);
      setError(null);
      
      const response = await userProfileApi.updateUserProfile(userId, request);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateProfile,
    updating,
    error,
    clearError: () => setError(null)
  };
};

// Hook para las estadísticas del usuario
export const useUserStats = (userId: string) => {
  const [stats, setStats] = useState<UserProfile['stats'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStats = await userProfileApi.getUserStats(userId);
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const refetch = () => {
    if (userId) {
      fetchStats();
    }
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
};

// Hook para subir avatar
export const useUploadAvatar = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (userId: string, avatarEmoji: string) => {
    try {
      setUploading(true);
      setError(null);
      
      const response = await userProfileApi.uploadAvatar(userId, avatarEmoji);
      
      if (response.success) {
        return response;
      } else {
        throw new Error('Error al subir el avatar');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir el avatar';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading,
    error,
    clearError: () => setError(null)
  };
};
