import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  token: string;
  userId: number;
  rol: string;
}

interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string; // 'ADMIN', 'CIUDADANO', 'EMPRESA_VIGILADA'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8081/auth/login';
  private registerUrl = 'http://localhost:8081/auth/register';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(this.loginUrl, { email, password }, { headers }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId.toString());
          localStorage.setItem('role', res.rol);
        }
      }),
      catchError(error => throwError(() => new Error('Credenciales inválidas o error del servidor')))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(this.registerUrl, data, { headers }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId.toString());
          localStorage.setItem('role', res.rol);
        }
      }),
      catchError(error => throwError(() => new Error('Error durante el registro')))
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
