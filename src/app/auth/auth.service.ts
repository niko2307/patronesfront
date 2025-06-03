import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
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

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(this.loginUrl, { email, password }, { headers }).pipe(
      tap(res => localStorage.setItem('token', res.token)),
      catchError(error => throwError(() => new Error('Credenciales inválidas o error del servidor')))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(this.registerUrl, data, { headers }).pipe(
      tap(res => localStorage.setItem('token', res.token)),
      catchError(error => throwError(() => new Error('Error durante el registro')))
    );
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
