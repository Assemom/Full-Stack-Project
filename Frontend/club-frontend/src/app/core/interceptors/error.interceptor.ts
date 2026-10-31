import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { TOKEN_KEY } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        router.navigateByUrl('/auth/login');
      }

      if (error.status === 0) {
        toast.error('Unable to connect to the server. Please try again later.');
        return throwError(() => error);
      }

      const apiError = error.error as ApiResponse<unknown> | undefined;
      const message = apiError?.errors?.join(', ') || apiError?.message || 'Something went wrong';
      toast.error(message);
      return throwError(() => error);
    }),
  );
};
