export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: number;
  username: string;
  email: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  iat?: number;
  exp?: number;
}
