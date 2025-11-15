import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const apiInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');
  
  // Clone the request and add authorization header if token exists
  let authReq = req;
  if (token && !req.url.includes('/onboarding/')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Add content type for non-file uploads
  if (!authReq.headers.has('Content-Type') && !(authReq.body instanceof FormData)) {
    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Log the request
  console.log('API Request:', {
    method: authReq.method,
    url: authReq.url,
    headers: authReq.headers.keys(),
    body: authReq.body
  });

  return next(authReq).pipe(
    catchError(error => {
      console.error('API Error:', error);
      
      if (error.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        router.navigate(['/login']);
        snackBar.open('Session expired. Please login again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status === 403) {
        snackBar.open('Access forbidden.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } else if (error.status >= 500) {
        snackBar.open('Server error. Please try again later.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
      
      return throwError(() => error);
    })
  );
};