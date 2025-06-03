import { Component, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import gsap from 'gsap';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private el = inject(ElementRef<HTMLElement>);

  email = '';
  password = '';
  error = '';

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      gsap.from(this.el.nativeElement.querySelector('.login-title'), {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: 'power2.out'
      });
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      const card = this.el.nativeElement.querySelector('.login-card');
      if (card) {
        gsap.from(card, {
          duration: 1,
          opacity: 0,
          y: 50,
          ease: 'power4.out'
        });
      }
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res.token;
        localStorage.setItem('token', token);

        try {
          const decoded: any = jwtDecode(token);
          let role = decoded.rol || decoded.role || decoded.authorities?.[0];

          // Normalizar rol quitando prefijo ROLE_
          if (role?.startsWith('ROLE_')) {
            role = role.replace('ROLE_', '');
          }

          localStorage.setItem('role', role);

          if (role === 'ADMIN') this.router.navigate(['/admin']);
          else if (role === 'CIUDADANO') this.router.navigate(['/ciudadano']);
          else if (role === 'EMPRESA_VIGILADA') this.router.navigate(['/empresa']);
          else this.router.navigate(['/login']);
        } catch (e) {
          console.error('Error al decodificar token', e);
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error de autenticación';
      }
    });
  }
}
