import { 
  SONG_STATUS, 
  LICENSE_STATUS, 
  LICENSE_TYPES, 
  CHAT_STATUS, 
  MESSAGE_STATUS, 
  MESSAGE_TYPE, 
  APP_MODES,
  MUSIC_GENRES 
} from '../constants';

// Tipos base
export type SongStatus = typeof SONG_STATUS[keyof typeof SONG_STATUS];
export type LicenseStatus = typeof LICENSE_STATUS[keyof typeof LICENSE_STATUS];
export type LicenseType = typeof LICENSE_TYPES[keyof typeof LICENSE_TYPES];
export type ChatStatus = typeof CHAT_STATUS[keyof typeof CHAT_STATUS];
export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];
export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];
export type AppMode = typeof APP_MODES[keyof typeof APP_MODES];
export type MusicGenre = typeof MUSIC_GENRES[keyof typeof MUSIC_GENRES];

// Usuario
export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
  bio?: string;
  lastActivity?: string;
  isActive?: boolean;
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
  favoriteGenres?: MusicGenre[];
}

// Canción
export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  genre: MusicGenre;
  duration: number; // en segundos
  status: SongStatus;
  price: number;
  coverImage?: string;
  audioFile?: string;
  description?: string;
  tags?: string[];
  licenseType: LicenseType;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  metadata?: SongMetadata;
}

export interface SongMetadata {
  bitrate?: number;
  sampleRate?: number;
  format?: string;
  size?: number;
  bpm?: number;
  key?: string;
}

export interface CreateSongRequest {
  title: string;
  genre: MusicGenre;
  price: number;
  description?: string;
  tags?: string[];
  licenseType: LicenseType;
}

export interface UpdateSongRequest extends Partial<CreateSongRequest> {
  status?: SongStatus;
}

// Licencia
export interface License {
  id: string;
  songId: string;
  song?: Song;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  type: LicenseType;
  status: LicenseStatus;
  price: number;
  purchasedAt: string;
  expiresAt?: string;
  usageRights: UsageRights;
  downloadUrl?: string;
  downloadCount: number;
  maxDownloads: number;
}

export interface UsageRights {
  commercial: boolean;
  modification: boolean;
  distribution: boolean;
  attribution: boolean;
  exclusivity: boolean;
  territory?: string[];
  duration?: number; // en meses
}

export interface CreateLicenseRequest {
  songId: string;
  type: LicenseType;
  usageRights?: Partial<UsageRights>;
}

// Chat
export interface Chat {
  id: string;
  participants: string[];
  participantDetails?: User[];
  songId?: string;
  song?: Song;
  status: ChatStatus;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount: number;
  metadata?: ChatMetadata;
}

export interface ChatMetadata {
  title?: string;
  description?: string;
  archived?: boolean;
  mutedBy?: string[];
}

export interface CreateChatRequest {
  participantId: string;
  songId?: string;
  message?: string;
}

// Mensaje
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender?: User;
  type: MessageType;
  content: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  imageUrl?: string;
  audioUrl?: string;
  duration?: number;
}

export interface SendMessageRequest {
  content: string;
  type?: MessageType;
  metadata?: MessageMetadata;
}

// Pago
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  licenseId: string;
  license?: License;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  createdAt: string;
  completedAt?: string;
  failedAt?: string;
  metadata?: PaymentMetadata;
}

export interface PaymentMetadata {
  stripePaymentIntentId?: string;
  refundId?: string;
  failureReason?: string;
}

// Estadísticas
export interface OverviewStats {
  totalSongs: number;
  totalLicenses: number;
  totalRevenue: number;
  totalUsers: number;
  thisMonth: {
    songs: number;
    licenses: number;
    revenue: number;
    users: number;
  };
}

export interface SongStats {
  songId: string;
  song?: Song;
  views: number;
  downloads: number;
  revenue: number;
  licensesSold: number;
  period: string;
}

export interface RevenueStats {
  period: string;
  totalRevenue: number;
  totalSales: number;
  averagePrice: number;
  topSongs: Array<{
    songId: string;
    song?: Song;
    revenue: number;
    sales: number;
  }>;
}

// Respuestas de API
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

// Filtros y búsqueda
export interface SongFilters {
  genre?: MusicGenre;
  status?: SongStatus;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  search?: string;
  tags?: string[];
  artistId?: string;
}

export interface LicenseFilters {
  status?: LicenseStatus;
  type?: LicenseType;
  songId?: string;
  buyerId?: string;
  sellerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ChatFilters {
  status?: ChatStatus;
  songId?: string;
  participantId?: string;
  hasUnread?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// Configuración de paginación
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Errores tipados
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  field: string;
  value: any;
}

export interface AuthError extends ApiError {
  code: 'AUTH_ERROR' | 'TOKEN_EXPIRED' | 'INSUFFICIENT_PERMISSIONS';
}

export interface NotFoundError extends ApiError {
  code: 'NOT_FOUND';
  resource: string;
  id: string;
}

// Formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface SongForm {
  title: string;
  genre: MusicGenre;
  price: number;
  description?: string;
  tags?: string[];
  licenseType: LicenseType;
  audioFile?: File;
  coverImage?: File;
}

export interface ProfileForm {
  name?: string;
  bio?: string;
  avatar?: File;
  preferences?: Partial<UserPreferences>;
}

// Estados de la UI
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

export interface PaginatedState<T> extends AsyncState<T[]> {
  pagination: PaginationInfo | null;
  hasMore: boolean;
}

// WebSocket
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface ChatWebSocketMessage extends WebSocketMessage {
  type: 'new_message' | 'message_read' | 'user_typing';
  payload: {
    chatId: string;
    message?: Message;
    userId?: string;
  };
}
