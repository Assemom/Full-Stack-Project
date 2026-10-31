import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../models/auth.model';

interface JwtPayload {
  exp?: number;
  email?: string;
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): UserRole | null {
  const payload = decodeToken(token);
  const rawRole =
    payload?.role ??
    payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
  return role === 'Admin' || role === 'Coach' || role === 'Member' ? role : null;
}

export function getUserIdFromToken(token: string): string | null {
  return decodeToken(token)?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
}

export function getExpiryFromToken(token: string): number | undefined {
  return decodeToken(token)?.exp;
}

export function isTokenExpired(token: string): boolean {
  const exp = getExpiryFromToken(token);
  return !!exp && Date.now() >= exp * 1000;
}
