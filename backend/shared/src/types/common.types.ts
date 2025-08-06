export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceHealthCheck {
  status: 'up' | 'down';
  timestamp: Date;
  service: string;
  dependencies?: Record<string, 'up' | 'down'>;
}
