import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const role = localStorage.getItem('role');

    if (isLoggedIn && role === 'ADMIN') {
      return true;
    }

    // Usuario no autenticado o no tiene rol ADMIN
    this.router.navigate(['/login']);
    return false;
  }
}
