import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = localStorage.getItem('role');
    const expectedRoles = route.data['roles'] as string[]; // ej: ['ADMIN', 'CIUDADANO']

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles && !expectedRoles.includes(userRole || '')) {
      this.router.navigate(['/unauthorized']); // Página opcional
      return false;
    }

    return true;
  }
}
