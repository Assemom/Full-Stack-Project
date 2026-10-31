import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { SubscriptionStatus } from '../models/enums.model';
import { CreateSubscriptionDto, SubscriptionDto, UpdateSubscriptionDto } from '../models/subscription.model';
import { PagedResult } from '../models/paged-result.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private api = inject(ApiService);
  private base = API_ROUTES.subscriptions;

  getAll() { return this.api.get<SubscriptionDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<SubscriptionDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getByStatus(status: SubscriptionStatus | 'all') { return this.api.get<SubscriptionDto[]>(API_ROUTES.adminSubscriptions, { status }); }
  getMine() { return this.api.get<SubscriptionDto[]>(API_ROUTES.memberSubscriptionsMine); }
  getById(id: number) { return this.api.get<SubscriptionDto>(`${this.base}/${id}`); }
  create(dto: CreateSubscriptionDto) { return this.api.post<SubscriptionDto, CreateSubscriptionDto>(this.base, dto); }
  update(id: number, dto: UpdateSubscriptionDto) { return this.api.put<SubscriptionDto, UpdateSubscriptionDto>(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }
}
