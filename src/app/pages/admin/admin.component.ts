import { Component, OnInit, AfterViewInit, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import gsap from 'gsap';
import { AdminService } from './admin.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  activeSection: string = 'usuarios';
  menuOpen: boolean = false;

  usuarios: any[] = [];
  empresas: any[] = [];
  quejas: any[] = [];
  historial: any[] = [];

  nuevaEmpresa = { nombre: '', nit: '', direccion: '' };
  nuevoHistorial = { quejaId: 0, estado: '', observacion: '' };

  private router = inject(Router);
  private el = inject(ElementRef);
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    document.querySelector('app-header')?.classList.add('hidden'); // Ocultar header

    if (typeof window !== 'undefined' && this.el.nativeElement.querySelector('.admin-header')) {
      gsap.from(this.el.nativeElement.querySelectorAll('.admin-header, .menu-toggle'), {
        duration: 1,
        y: -30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.el.nativeElement.querySelector('.admin-dashboard')) {
      gsap.from(this.el.nativeElement.querySelector('.admin-dashboard'), {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  cambiarSeccion(seccion: string): void {
    this.activeSection = seccion;
    gsap.from('.section-title', {
      duration: 0.6,
      x: -50,
      opacity: 0,
      ease: 'power2.out'
    });

    switch (seccion) {
      case 'usuarios':
        this.cargarUsuarios();
        break;
      case 'empresas':
        this.cargarEmpresas();
        break;
      case 'quejas':
        this.cargarQuejas();
        break;
    }
  }

 private cargarUsuarios(): void {
  const email = localStorage.getItem('email'); // o 'email' si lo guardaste así
  if (!email) return;

  this.adminService.getUsuariosPorEmail(email).subscribe({
    next: (data) => this.usuarios = [data], // lo envolvemos en un array si es un solo usuario
    error: (err) => console.error('Error al cargar usuario:', err)
  });
}
  private cargarEmpresas(): void {
    this.adminService.getEmpresas().subscribe(data => this.empresas = data);
  }

  private cargarQuejas(): void {
    this.adminService.getQuejas().subscribe(data => this.quejas = data);
  }

  cargarHistorialPorQueja(idQueja: number): void {
    this.adminService.getHistorialPorQueja(idQueja).subscribe({
      next: (data) => (this.historial = data),
      error: (err) => console.error('Error al cargar historial por queja:', err)
    });
  }

  cambiarEstadoQueja(id: number, nuevoEstado: string): void {
    this.nuevoHistorial.quejaId = id;
    this.nuevoHistorial.estado = nuevoEstado;
    this.nuevoHistorial.observacion = 'Cambio realizado por el admin';

    this.adminService.registrarHistorial(this.nuevoHistorial).subscribe({
      next: () => this.cargarQuejas(),
      error: err => console.error('Error al registrar historial:', err)
    });
  }

  registrarEmpresa(): void {
    this.adminService.registrarEmpresa(this.nuevaEmpresa).subscribe({
      next: () => {
        this.cargarEmpresas();
        this.nuevaEmpresa = { nombre: '', nit: '', direccion: '' };
      },
      error: err => console.error('Error al registrar empresa:', err)
    });
  }
}
