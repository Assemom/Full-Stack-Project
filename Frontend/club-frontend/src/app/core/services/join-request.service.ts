import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { ApiService } from './api.service';
import { CreateJoinRequestDto, JoinRequestDto, RespondJoinRequestDto } from '../models/join-request.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class JoinRequestService {
  private api = inject(ApiService);

  create(dto: CreateJoinRequestDto) {
    return this.api.post<JoinRequestDto, CreateJoinRequestDto>(API_ROUTES.joinRequests.base, dto);
  }

  getMine() {
    return this.api.get<JoinRequestDto[]>(API_ROUTES.joinRequests.mine);
  }

  getPending() {
    return this.api.get<JoinRequestDto[]>(API_ROUTES.joinRequests.pending);
  }

  getAll() {
    return this.api.get<JoinRequestDto[]>(API_ROUTES.joinRequests.base);
  }

  getAllPaged(page: number, pageSize: number, search?: string) {
    return this.api.get<PagedResult<JoinRequestDto>>(API_ROUTES.joinRequests.base, { page, pageSize, ...(search ? { search } : {}) });
  }

  respond(id: number, dto: RespondJoinRequestDto) {
    return this.api.put<JoinRequestDto, RespondJoinRequestDto>(`${API_ROUTES.joinRequests.base}/${id}/respond`, dto);
  }
}
