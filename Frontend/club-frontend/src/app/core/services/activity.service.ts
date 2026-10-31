import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { ActivityDto, CreateActivityDto, UpdateActivityDto } from '../models/activity.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private api = inject(ApiService);
  private base = API_ROUTES.activities;

  getAll() { return this.api.get<ActivityDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<ActivityDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getMineForCoach() { return this.api.get<ActivityDto[]>(API_ROUTES.coachActivitiesMine); }
  getById(id: number) { return this.api.get<ActivityDto>(`${this.base}/${id}`); }
  create(dto: CreateActivityDto) { return this.api.post<ActivityDto, CreateActivityDto>(this.base, dto); }
  update(id: number, dto: UpdateActivityDto) { return this.api.put<ActivityDto, UpdateActivityDto>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
