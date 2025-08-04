import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  set: (token: string) => {
    // Guardar en cookies (más seguro)
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // 7 días
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // También en localStorage como respaldo
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  get: (): string | null => {
    // Intentar obtener de cookies primero
    const cookieToken = Cookies.get(TOKEN_KEY);
    if (cookieToken) return cookieToken;
    
    // Fallback a localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    
    return null;
  },

  remove: () => {
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  exists: (): boolean => {
    return !!tokenStorage.get();
  }
};
