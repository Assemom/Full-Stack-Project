import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { CoachDto, CreateCoachDto, UpdateCoachDto } from '../models/coach.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CoachService {
  private api = inject(ApiService);
  private base = API_ROUTES.coaches;

  getAll() { return this.api.get<CoachDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<CoachDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getById(id: number) { return this.api.get<CoachDto>(`${this.base}/${id}`); }
  getMyProfile() { return this.api.get<CoachDto>(API_ROUTES.coachProfile); }
  create(dto: CreateCoachDto) { return this.api.post<CoachDto, CreateCoachDto>(this.base, dto); }
  update(id: number, dto: UpdateCoachDto) { return this.api.put<CoachDto, UpdateCoachDto>(`${this.base}/${id}`, dto); }
  updateMyProfile(dto: UpdateCoachDto) { return this.api.put<CoachDto, UpdateCoachDto>(API_ROUTES.coachProfile, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
