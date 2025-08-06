import { tokenStorage } from './tokenStorage';

/**
 * Decodifica un JWT sin verificar la firma (solo para obtener el payload)
 * NOTA: Esto NO valida la firma del token, solo extrae información
 */
export const decodeJWT = (token: string) => {
  try {
    console.log('🔧 [decodeJWT] Intentando decodificar token:', { 
      tokenLength: token.length, 
      tokenStart: token.substring(0, 20) + '...',
      tokenSample: token
    });
    
    const parts = token.split('.');
    console.log('🧩 [decodeJWT] Partes del token:', { 
      totalParts: parts.length,
      partLengths: parts.map(p => p.length)
    });
    
    if (parts.length !== 3) {
      console.error('❌ [decodeJWT] Token no tiene 3 partes, no es un JWT válido');
      throw new Error('Token JWT inválido');
    }

    console.log('📖 [decodeJWT] Decodificando payload base64:', parts[1]);
    const payload = JSON.parse(atob(parts[1]));
    console.log('✅ [decodeJWT] Payload decodificado exitosamente:', payload);
    return payload;
  } catch (error) {
    console.error('💥 [decodeJWT] Error decodificando token:', error);
    console.error('🔍 [decodeJWT] Token problemático:', token);
    return null;
  }
};

/**
 * Verifica si un token JWT ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    console.log('⏰ [isTokenExpired] Verificando expiración del token...');
    const payload = decodeJWT(token);
    
    if (!payload || !payload.exp) {
      console.warn('⚠️ [isTokenExpired] Token sin payload o sin campo exp');
      return true;
    }

    // exp está en segundos, Date.now() en milisegundos
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpTime = payload.exp;
    const isExpired = tokenExpTime < currentTime;
    
    console.log('🕐 [isTokenExpired] Comparación de tiempo:', {
      currentTime,
      tokenExpTime,
      isExpired,
      timeUntilExp: tokenExpTime - currentTime,
      expDate: new Date(tokenExpTime * 1000).toISOString()
    });
    
    return isExpired;
  } catch (error) {
    console.error('💥 [isTokenExpired] Error verificando expiración:', error);
    return true;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.get();
  console.log('🔍 [auth] Verificando autenticación:', { hasToken: !!token });
  
  if (!token) {
    console.log('❌ [auth] No hay token almacenado');
    return false;
  }

  if (isTokenExpired(token)) {
    // Si el token expiró, lo removemos
    console.log('⏰ [auth] Token expirado, removiendo del storage');
    tokenStorage.remove();
    return false;
  }

  console.log('✅ [auth] Token válido y no expirado');
  return true;
};

/**
 * Obtiene la información del usuario desde el token
 */
export const getUserFromToken = (token?: string) => {
  const userToken = token || tokenStorage.get();
  console.log('🔍 [auth] Obteniendo usuario del token:', { hasToken: !!userToken });
  
  if (!userToken) {
    console.log('❌ [auth] No hay token para extraer información');
    return null;
  }

  const payload = decodeJWT(userToken);
  console.log('📄 [auth] Payload del token decodificado:', payload);
  
  const userInfo = payload ? {
    id: parseInt(payload.sub || payload.id) || payload.id,
    email: payload.email,
    username: payload.username || payload.name,
    name: payload.name
  } : null;
  
  console.log('👤 [auth] Información de usuario extraída:', userInfo);
  return userInfo;
};

/**
 * Limpia la sesión del usuario
 */
export const logout = () => {
  tokenStorage.remove();
  
  // Redirigir al login si estamos en el cliente
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
