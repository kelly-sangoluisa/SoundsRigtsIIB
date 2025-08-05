import { tokenStorage } from '../utils/tokenStorage';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Tipos para las opciones de la API
export interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
  status: number;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Errores personalizados
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de conexión') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Tiempo de espera agotado') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Función principal para llamadas a la API
export async function fetchApi<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    requireAuth = true,
    timeout = 10000,
    headers = {},
    ...fetchOptions
  } = options;

  // Construir URL completa
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${urlPath}`;

  // Headers por defecto
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Agregar token de autenticación si es requerido
  if (requireAuth) {
    const token = tokenStorage.get();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      throw new ApiError('Token de autenticación requerido', 401);
    }
  }

  // Combinar headers
  const finalHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  // Configuración final de fetch
  const fetchConfig: RequestInit = {
    ...fetchOptions,
    headers: finalHeaders,
  };

  // Agregar body si es necesario y no es GET
  if (fetchConfig.method !== 'GET' && fetchConfig.body && typeof fetchConfig.body === 'object') {
    fetchConfig.body = JSON.stringify(fetchConfig.body);
  }

  // Crear AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Realizar la petición
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Intentar parsear la respuesta como JSON
    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Construir respuesta estandarizada
    const apiResponse: ApiResponse<T> = {
      data: responseData,
      success: response.ok,
      status: response.status,
      message: responseData?.message || (response.ok ? 'Operación exitosa' : 'Error en la operación'),
      error: response.ok ? undefined : (responseData?.error || responseData?.message || 'Error desconocido'),
    };

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      // Manejar errores específicos
      if (response.status === 401) {
        // Token expirado o inválido
        tokenStorage.remove();
        throw new ApiError('Sesión expirada. Por favor, inicia sesión nuevamente.', 401, responseData);
      }

      if (response.status === 403) {
        throw new ApiError('No tienes permisos para realizar esta acción.', 403, responseData);
      }

      if (response.status === 404) {
        throw new ApiError('Recurso no encontrado.', 404, responseData);
      }

      if (response.status === 429) {
        throw new ApiError('Demasiadas peticiones. Intenta de nuevo más tarde.', 429, responseData);
      }

      if (response.status >= 500) {
        throw new ApiError('Error interno del servidor. Intenta de nuevo más tarde.', response.status, responseData);
      }

      // Error genérico del cliente
      throw new ApiError(
        apiResponse.error || 'Error en la petición',
        response.status,
        responseData
      );
    }

    return apiResponse;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Manejar diferentes tipos de errores
    if (error instanceof ApiError) {
      throw error;
    }

    if (error && error.name === 'AbortError') {
      throw new TimeoutError(`La petición tardó más de ${timeout}ms en responder`);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Error de conexión. Verifica tu conexión a internet.');
    }

    // Error genérico
    throw new ApiError(
      (error && error.message) || 'Error inesperado en la petición',
      0,
      error
    );
  }
}

// Métodos de conveniencia
export const api = {
  // GET
  get: <T = any>(path: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchApi<T>(path, { ...options, method: 'GET' }),

  // POST
  post: <T = any>(path: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    fetchApi<T>(path, { ...options, method: 'POST', body: data }),

  // PUT
  put: <T = any>(path: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    fetchApi<T>(path, { ...options, method: 'PUT', body: data }),

  // PATCH
  patch: <T = any>(path: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    fetchApi<T>(path, { ...options, method: 'PATCH', body: data }),

  // DELETE
  delete: <T = any>(path: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchApi<T>(path, { ...options, method: 'DELETE' }),

  // Upload de archivos
  upload: <T = any>(path: string, file: File | FormData, options?: Omit<ApiOptions, 'method' | 'body'>) => {
    const formData = file instanceof FormData ? file : (() => {
      const fd = new FormData();
      fd.append('file', file);
      return fd;
    })();

    return fetchApi<T>(path, {
      ...options,
      method: 'POST',
      body: formData,
    });
  },
};

// Tipos para interceptores
type RequestInterceptor = (config: ApiOptions & { url: string }) => ApiOptions & { url: string };
type ResponseInterceptor = (response: ApiResponse) => ApiResponse;
type ErrorInterceptor = (error: Error) => Error;

// Interceptores para peticiones y respuestas (para logging, etc.)
export const apiInterceptors = {
  request: [] as RequestInterceptor[],
  response: [] as ResponseInterceptor[],
  error: [] as ErrorInterceptor[],

  addRequestInterceptor: (interceptor: RequestInterceptor) => {
    apiInterceptors.request.push(interceptor);
  },

  addResponseInterceptor: (interceptor: ResponseInterceptor) => {
    apiInterceptors.response.push(interceptor);
  },

  addErrorInterceptor: (interceptor: ErrorInterceptor) => {
    apiInterceptors.error.push(interceptor);
  },
};

// Configuración global
export const apiConfig = {
  setBaseUrl: (url: string) => {
    (global as any).API_BASE_URL = url;
  },
  
  setDefaultTimeout: (timeout: number) => {
    (global as any).DEFAULT_TIMEOUT = timeout;
  },
};

export default api;
