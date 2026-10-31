import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { BookingDto, CreateBookingDto, UpdateBookingDto } from '../models/booking.model';
import { PagedResult } from '../models/paged-result.model';
import { toBackendTime } from '../utils/date-time.util';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private api = inject(ApiService);
  private base = API_ROUTES.bookings;

  getAll() { return this.api.get<BookingDto[]>(this.base); }
  getAllPaged(page: number, pageSize: number, search?: string) { return this.api.get<PagedResult<BookingDto>>(this.base, { page, pageSize, ...(search ? { search } : {}) }); }
  getTodayForAdmin() { return this.api.get<BookingDto[]>(API_ROUTES.adminBookingsToday); }
  getMineForCoach() { return this.api.get<BookingDto[]>(API_ROUTES.coachBookingsMine); }
  getMineForMember() { return this.api.get<BookingDto[]>(API_ROUTES.memberBookingsMine); }
  getById(id: number) { return this.api.get<BookingDto>(`${this.base}/${id}`); }
  create(dto: CreateBookingDto) { return this.api.post<BookingDto, CreateBookingDto>(this.base, this.normalize(dto)); }
  update(id: number, dto: UpdateBookingDto) { return this.api.put<BookingDto, UpdateBookingDto>(`${this.base}/${id}`, this.normalize(dto)); }
  delete(id: number) { return this.api.delete<boolean>(`${this.base}/${id}`); }

  private normalize<T extends CreateBookingDto | UpdateBookingDto>(dto: T): T {
    return {
      ...dto,
      startTime: dto.startTime ? toBackendTime(dto.startTime) : dto.startTime,
      endTime: dto.endTime ? toBackendTime(dto.endTime) : dto.endTime,
    };
  }
}
