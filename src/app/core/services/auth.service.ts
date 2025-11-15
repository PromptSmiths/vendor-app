import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private currentUserSubject = new BehaviorSubject<any>(null);
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock authentication for demo purposes
    if (credentials.email === 'admin@company.com' && credentials.password === 'password123') {
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          name: 'Admin User',
          role: 'admin'
        }
      };
      
      localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
      this.currentUserSubject.next(mockResponse.user);
      
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(mockResponse);
          observer.complete();
        }, 1000); // Simulate network delay
      });
    } else {
      return new Observable(observer => {
        setTimeout(() => {
          observer.error({ error: { message: 'Invalid credentials' } });
        }, 1000);
      });
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('Checking authentication, token:', token ? 'exists' : 'not found');
    
    if (!token) {
      return false;
    }
    
    // For mock tokens, just check if it exists and starts with 'mock-jwt-token'
    if (token.startsWith('mock-jwt-token')) {
      return true;
    }
    
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData && this.isAuthenticated()) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  private isTokenExpired(token: string): boolean {
    // For mock tokens, never expire
    if (token.startsWith('mock-jwt-token')) {
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}