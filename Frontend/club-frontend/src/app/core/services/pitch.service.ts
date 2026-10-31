import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { CreatePitchDto, PitchDto, UpdatePitchDto } from '../models/pitch.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PitchService {
  private api = inject(ApiService);
  private base = API_ROUTES.pitches;

  getAll() { return this.api.get<PitchDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<PitchDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getById(id: number) { return this.api.get<PitchDto>(`${this.base}/${id}`); }
  create(dto: CreatePitchDto) { return this.api.post<PitchDto, CreatePitchDto>(this.base, dto); }
  update(id: number, dto: UpdatePitchDto) { return this.api.put<PitchDto, UpdatePitchDto>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
