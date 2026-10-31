import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { AdminDashboardDto, MemberDashboardDto, CoachDashboardDto } from '../models/dashboard.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);

  getAdminStats() { return this.api.get<AdminDashboardDto>(API_ROUTES.dashboard.admin); }
  getMemberStats() { return this.api.get<MemberDashboardDto>(API_ROUTES.dashboard.member); }
  getCoachStats() { return this.api.get<CoachDashboardDto>(API_ROUTES.dashboard.coach); }
}
