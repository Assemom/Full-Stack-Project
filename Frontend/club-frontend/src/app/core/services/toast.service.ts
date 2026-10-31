import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastr = inject(ToastrService);

  success(message: string): void {
    this.toastr.success(message);
  }

  info(message: string): void {
    this.toastr.info(message);
  }

  error(message: string): void {
    this.toastr.error(message);
  }

  fromApi<T>(response: ApiResponse<T>, fallback = 'Done'): void {
    if (response.success) {
      this.success(response.message || fallback);
    } else {
      this.error(response.errors?.join(', ') || response.message || 'Something went wrong');
    }
  }
}
