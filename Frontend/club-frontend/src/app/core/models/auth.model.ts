export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  phoneNumber?: string | null;
  address?: string | null;
  userName?: string | null;
}

export interface UserDto {
  username?: string | null;
  email?: string | null;
  token?: string | null;
}

export type UserRole = 'Admin' | 'Coach' | 'Member';

export interface AuthUser {
  username?: string | null;
  email?: string | null;
  token: string;
  role: UserRole;
  userId?: string | null;
  memberId?: number | null;
  expiresAt?: number;
}
