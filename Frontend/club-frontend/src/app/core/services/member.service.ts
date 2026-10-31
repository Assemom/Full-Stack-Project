import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { CreateMemberDto, MemberDto, UpdateMemberDto } from '../models/member.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private api = inject(ApiService);
  private base = API_ROUTES.members;

  getAll() { return this.api.get<MemberDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<MemberDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getById(id: number) { return this.api.get<MemberDto>(`${this.base}/${id}`); }
  getMe() { return this.api.get<MemberDto>(API_ROUTES.memberMe); }
  updateMyProfile(dto: UpdateMemberDto) { return this.api.put<MemberDto, UpdateMemberDto>(API_ROUTES.memberProfileUpdate, dto); }
  create(dto: CreateMemberDto) { return this.api.post<MemberDto, CreateMemberDto>(this.base, dto); }
  update(id: number, dto: UpdateMemberDto) { return this.api.put<MemberDto, UpdateMemberDto>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
