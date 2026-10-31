import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { AdminUserDto } from '../models/admin-user.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getAll() { return this.api.get<AdminUserDto[]>(API_ROUTES.adminUsers); }
}
