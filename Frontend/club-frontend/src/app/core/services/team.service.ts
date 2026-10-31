import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { CreateTeamDto, TeamDto, UpdateTeamDto } from '../models/team.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private api = inject(ApiService);
  private base = API_ROUTES.teams;

  getAll() { return this.api.get<TeamDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<TeamDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getById(id: number) { return this.api.get<TeamDto>(`${this.base}/${id}`); }
  create(dto: CreateTeamDto) { return this.api.post<TeamDto, CreateTeamDto>(this.base, dto); }
  update(id: number, dto: UpdateTeamDto) { return this.api.put<TeamDto, UpdateTeamDto>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
