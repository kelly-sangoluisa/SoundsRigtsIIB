import { tokenStorage } from './tokenStorage';

/**
 * Decodifica un JWT sin verificar la firma (solo para obtener el payload)
 * NOTA: Esto NO valida la firma del token, solo extrae información
 */
export const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

/**
 * Verifica si un token JWT ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return true;
    }

    // exp está en segundos, Date.now() en milisegundos
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = tokenStorage.get();
  
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    // Si el token expiró, lo removemos
    tokenStorage.remove();
    return false;
  }

  return true;
};

/**
 * Obtiene la información del usuario desde el token
 */
export const getUserFromToken = (token?: string) => {
  const userToken = token || tokenStorage.get();
  
  if (!userToken) {
    return null;
  }

  const payload = decodeJWT(userToken);
  return payload ? {
    id: parseInt(payload.sub || payload.id) || payload.id,
    email: payload.email,
    username: payload.username || payload.name,
    name: payload.name
  } : null;
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
