// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Almacenamiento del token
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  set: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  remove: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

// Interfaces
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

export interface ApiOptions extends Omit<RequestInit, 'headers'> {
  requireAuth?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

// Clases de error personalizadas
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Error de red') {
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

// Funciones helper
const buildApiUrl = (path: string): string => {
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${urlPath}`;
};

const buildHeaders = (requireAuth: boolean, additionalHeaders: Record<string, string>): Record<string, string> => {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (requireAuth) {
    const token = tokenStorage.get();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      throw new ApiError('Token de autenticación requerido', 401);
    }
  }

  return { ...defaultHeaders, ...additionalHeaders };
};

const prepareFetchConfig = (options: ApiOptions, headers: Record<string, string>): RequestInit => {
  const { requireAuth, timeout, headers: _, ...fetchOptions } = options;
  
  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  if (config.method !== 'GET' && config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  return config;
};

const handleResponseErrors = (response: Response, responseData: any): void => {
  if (response.status === 401) {
    tokenStorage.remove();
    throw new ApiError('Sesión expirada. Por favor, inicia sesión nuevamente.', 401, responseData);
  }

  if (response.status === 403) {
    throw new ApiError('No tienes permisos para realizar esta acción.', 403, responseData);
  }

  if (response.status === 404) {
    throw new ApiError('Recurso no encontrado.', 404, responseData);
  }

  if (response.status >= 500) {
    throw new ApiError('Error interno del servidor. Inténtalo más tarde.', response.status, responseData);
  }

  if (!response.ok) {
    throw new ApiError(
      responseData?.message || responseData?.error || 'Error en la operación',
      response.status,
      responseData
    );
  }
};

// Función principal de API (optimizada)
export async function fetchApi<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { timeout = 10000, headers = {}, requireAuth = true } = options;

  try {
    const url = buildApiUrl(path);
    const finalHeaders = buildHeaders(requireAuth, headers);
    const fetchConfig = prepareFetchConfig(options, finalHeaders);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parsear respuesta
    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes('application/json') 
      ? await response.json() 
      : await response.text();

    // Construir respuesta
    const apiResponse: ApiResponse<T> = {
      data: responseData,
      success: response.ok,
      status: response.status,
      message: responseData?.message || (response.ok ? 'Operación exitosa' : 'Error en la operación'),
      error: response.ok ? undefined : (responseData?.error || responseData?.message || 'Error desconocido'),
      pagination: responseData?.pagination,
    };

    handleResponseErrors(response, responseData);
    return apiResponse;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Timeout después de ${timeout}ms`);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Error de conexión de red');
    }

    console.error('API Error:', error);
    return {
      data: undefined,
      success: false,
      status: error.status || 500,
      message: 'Error en la operación',
      error: error.message || 'Error desconocido',
    };
  }
}

// Métodos de conveniencia
export const api = {
  get: <T = any>(path: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchApi<T>(path, { ...options, method: 'GET' }),

  post: <T = any>(path: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    fetchApi<T>(path, { ...options, method: 'POST', body: data }),

  put: <T = any>(path: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    fetchApi<T>(path, { ...options, method: 'PUT', body: data }),

  patch: <T = any>(path: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    fetchApi<T>(path, { ...options, method: 'PATCH', body: data }),

  delete: <T = any>(path: string, options?: Omit<ApiOptions, 'method'>) =>
    fetchApi<T>(path, { ...options, method: 'DELETE' }),

  upload: <T = any>(path: string, formData: FormData, options?: Omit<ApiOptions, 'method' | 'body' | 'headers'>) =>
    fetchApi<T>(path, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {}, // FormData establece automáticamente Content-Type
    }),
};

// Interceptores (para logging, transformaciones, etc.)
export const interceptors = {
  request: {
    use: (fn: (config: ApiOptions) => ApiOptions | Promise<ApiOptions>) => {
      // Implementar interceptor de request
      console.log('Request interceptor registered:', fn);
    },
  },
  response: {
    use: (
      onFulfilled?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>,
      onRejected?: (error: any) => any
    ) => {
      // Implementar interceptor de response
      console.log('Response interceptor registered:', { onFulfilled, onRejected });
    },
  },
};

export default api;
