import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  set: (token: string) => {
    console.log('💾 [tokenStorage] Guardando token:', { 
      tokenLength: token.length,
      isProduction: process.env.NODE_ENV === 'production'
    });
    
    // Guardar en cookies (más seguro)
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // 7 días
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // También en localStorage como respaldo
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      console.log('✅ [tokenStorage] Token guardado en cookies y localStorage');
    } else {
      console.log('⚠️ [tokenStorage] Window no disponible, solo guardado en cookies');
    }
  },

  get: (): string | null => {
    // Intentar obtener de cookies primero
    const cookieToken = Cookies.get(TOKEN_KEY);
    console.log('🔍 [tokenStorage] Buscando token:', { 
      hasCookieToken: !!cookieToken,
      cookieLength: cookieToken?.length || 0
    });
    
    if (cookieToken) {
      console.log('✅ [tokenStorage] Token encontrado en cookies');
      return cookieToken;
    }
    
    // Fallback a localStorage
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem(TOKEN_KEY);
      console.log('🔍 [tokenStorage] Token en localStorage:', { 
        hasLocalToken: !!localToken,
        localLength: localToken?.length || 0
      });
      return localToken;
    }
    
    console.log('❌ [tokenStorage] No se encontró token en ningún storage');
    return null;
  },

  remove: () => {
    console.log('🗑️ [tokenStorage] Removiendo token de todos los storages');
    Cookies.remove(TOKEN_KEY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      console.log('✅ [tokenStorage] Token removido de cookies y localStorage');
    } else {
      console.log('✅ [tokenStorage] Token removido de cookies (localStorage no disponible)');
    }
  },

  exists: (): boolean => {
    const hasToken = !!tokenStorage.get();
    console.log('❓ [tokenStorage] Verificando existencia de token:', { exists: hasToken });
    return hasToken;
  }
};
