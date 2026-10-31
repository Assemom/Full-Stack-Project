import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { CreatePlanDto, PlanDto, UpdatePlanDto } from '../models/plan.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private api = inject(ApiService);
  private base = API_ROUTES.plans;

  getAll() { return this.api.get<PlanDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<PlanDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getById(id: number) { return this.api.get<PlanDto>(`${this.base}/${id}`); }
  create(dto: CreatePlanDto) { return this.api.post<PlanDto, CreatePlanDto>(this.base, dto); }
  update(id: number, dto: UpdatePlanDto) { return this.api.put<PlanDto, UpdatePlanDto>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
