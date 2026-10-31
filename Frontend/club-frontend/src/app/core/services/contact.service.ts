import { Injectable, inject } from '@angular/core';
import { API_ROUTES } from '../config/api.config';
import { ApiService } from './api.service';
import { CreateContactInquiryDto } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private api = inject(ApiService);

  submitInquiry(dto: CreateContactInquiryDto) {
    return this.api.post<string, CreateContactInquiryDto>(API_ROUTES.contact, dto);
  }
}