import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { API_ROUTES } from '../config/api.config';
import { AuthUser, LoginDto, RegisterDto, UserDto, UserRole } from '../models/auth.model';
import { getExpiryFromToken, getRoleFromToken, getUserIdFromToken, isTokenExpired } from '../utils/jwt.util';
import { ApiService } from './api.service';
import { MemberService } from './member.service';

export const TOKEN_KEY = 'club_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private userSignal = signal<AuthUser | null>(this.readStoredUser());

  currentUser = computed(() => this.userSignal());
  currentRole = computed(() => this.userSignal()?.role ?? null);
  currentUserId = computed(() => this.userSignal()?.userId ?? null);
  currentMemberId = computed(() => this.userSignal()?.memberId ?? null);

  login(dto: LoginDto) {
    return this.api.post<UserDto, LoginDto>(API_ROUTES.auth.login, dto).pipe(
      tap((response) => {
        if (response.success && response.data?.token) {
          this.setToken(response.data.token, response.data);
        }
      }),
    );
  }

  register(dto: RegisterDto) {
    return this.api.post<UserDto, RegisterDto>(API_ROUTES.auth.register, dto).pipe(
      tap((response) => {
        if (response.success && response.data?.token) {
          this.setToken(response.data.token, response.data);
        }
      }),
    );
  }

  setToken(token: string, user?: UserDto): boolean {
    const role = getRoleFromToken(token);
    if (!role) {
      return false;
    }

    const userId = getUserIdFromToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    this.userSignal.set({
      username: user?.username,
      email: user?.email,
      token,
      role,
      userId: userId ?? undefined,
      memberId: null,
      expiresAt: getExpiryFromToken(token),
    });

    if (role === 'Member') {
      this.fetchMemberProfile(userId);
    }

    return true;
  }

  private fetchMemberProfile(userId: string | null): void {
    if (!userId) return;

    this.memberService.getMe().pipe(
      catchError(() => of(null)),
    ).subscribe((res) => {
      if (res?.success && res.data) {
        this.userSignal.update((u) => u ? { ...u, memberId: res.data!.id } : u);
        return;
      }

      const u = this.userSignal();
      if (!u?.email) return;

      this.memberService.create({
        email: u.email,
        password: 'Placeholder123!',
        userName: u.username ?? undefined,
      }).pipe(catchError(() => of(null))).subscribe((created) => {
        if (created?.success && created.data) {
          this.userSignal.update((s) => s ? { ...s, memberId: created.data!.id } : s);
        }
      });
    });
  }

  token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.token();
    return !!token && !isTokenExpired(token) && !!this.currentRole();
  }

  homeRoute(role: UserRole | null = this.currentRole()): string {
    if (role === 'Admin') return '/admin/dashboard';
    if (role === 'Coach') return '/coach/dashboard';
    if (role === 'Member') return '/';
    return '/auth/login';
  }

  redirectHome(): void {
    this.router.navigateByUrl(this.homeRoute());
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSignal.set(null);
    this.router.navigateByUrl('/auth/login');
  }

  private readStoredUser(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    const role = getRoleFromToken(token);
    if (!role) {
      return null;
    }

    const userId = getUserIdFromToken(token);
    const user: AuthUser = { token, role, userId: userId ?? undefined, memberId: null, expiresAt: getExpiryFromToken(token) };

    if (role === 'Member' && userId) {
      this.fetchMemberProfile(userId);
    }

    return user;
  }
}
