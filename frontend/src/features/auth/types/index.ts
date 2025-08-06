export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface RegisterResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
}
