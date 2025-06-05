import { Component, OnInit, AfterViewInit, inject, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {
  signUpForm!: FormGroup;
  errorMessage: string = '';
  private el = inject(ElementRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['', Validators.required] // 'ADMIN', 'CIUDADANO', 'EMPRESA_VIGILADA'
    });

    if (typeof window !== 'undefined') {
      gsap.from(this.el.nativeElement.querySelector('.signup-title'), {
        duration: 0.6,
        opacity: 0,
        y: 20,
        ease: 'power2.out'
      });
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      const card = this.el.nativeElement.querySelector('.signup-card');
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

  onSubmit(): void {
    if (this.signUpForm.invalid) return;

    const { nombre, email, password, rol } = this.signUpForm.value;

    this.authService.register({ nombre, email, password, rol }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId.toString());
        localStorage.setItem('role', res.rol);

        if (res.rol === 'ADMIN') this.router.navigate(['/admin']);
        else if (res.rol === 'CIUDADANO') this.router.navigate(['/ciudadano']);
        else if (res.rol === 'EMPRESA_VIGILADA') this.router.navigate(['/empresa']);
        else this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error durante el registro';
        console.error(err);
      }
    });
  }
}
