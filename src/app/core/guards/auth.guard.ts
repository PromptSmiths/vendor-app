import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Auth guard checking authentication...');
  const isAuthenticated = authService.isAuthenticated();
  console.log('Is authenticated:', isAuthenticated);

  if (isAuthenticated) {
    return true;
  }

  console.log('Not authenticated, redirecting to login');
  // Redirect to login page with return url
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};