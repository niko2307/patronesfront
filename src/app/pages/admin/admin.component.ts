import { Component, OnInit, AfterViewInit, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import gsap from 'gsap';
import { AdminService } from './admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  activeSection: string = 'usuarios';
  menuOpen: boolean = false;

  emailBusqueda: string = '';
  usuarios: any[] = [];
  empresas: any[] = [];
  quejas: any[] = [];
  historial: any[] = [];
  quejasAgrupadas: any[] = [];
  empresasUnicas: string[] = [];
  empresaSeleccionada: string = '';
 

  estadoSeleccionado: string = 'ACTIVA';

  nuevaEmpresa = { nombre: '', tipoServicio: '' };
  nuevoHistorial = { quejaId: 0, estado: '', observacion: '' };

  private router = inject(Router);
  private el = inject(ElementRef);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    document.querySelector('app-header')?.classList.add('hidden');

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
        this.usuarios = [];
        break;
      case 'empresas':
        this.cargarEmpresas();
        break;
      case 'quejas':
        this.filtrarPorEstado();
        break;
      case 'agrupadas':
         this.verAgrupadasPorEmpresa();
         break;

    }
  }

  buscarUsuario(): void {
    if (!this.emailBusqueda) return;

    this.adminService.getUsuariosPorEmail(this.emailBusqueda).subscribe({
      next: (data) => this.usuarios = [data],
      error: (err) => {
        console.error('Error al buscar usuario:', err);
        this.usuarios = [];
      }
    });
  }

  private cargarEmpresas(): void {
    this.adminService.getEmpresas().subscribe(data => this.empresas = data);
  }

  filtrarPorEstado(): void {
    this.adminService.getQuejasPorEstado(this.estadoSeleccionado).subscribe({
      next: (data) => this.quejas = data,
      error: (err) => {
        console.error('Error al cargar quejas por estado:', err);
        this.quejas = [];
      }
    });
  }

  cargarHistorialPorQueja(idQueja: number): void {
    this.adminService.getHistorialPorQueja(idQueja).subscribe({
      next: (data) => (this.historial = data),
      error: (err) => console.error('Error al cargar historial por queja:', err)
    });
  }

  cambiarEstadoQueja(id: number, nuevoEstado: string): void {
  const quejaOriginal = this.quejas.find(q => q.id === id);
  if (!quejaOriginal || !quejaOriginal.estado) return;

  const historial = {
    quejaId: id,
    estadoAnterior: quejaOriginal.estado,
    estadoNuevo: nuevoEstado,
    fechaCambio: new Date().toISOString() // formato ISO requerido por el backend
  };

  this.adminService.registrarHistorial(historial).subscribe({
    next: () => this.filtrarPorEstado(),
    error: err => console.error('Error al registrar historial:', err)
  });
}


  registrarEmpresa(): void {
    const empresaData = {
      nombre: this.nuevaEmpresa.nombre,
      tipoServicio: this.nuevaEmpresa.tipoServicio
    };

    this.adminService.registrarEmpresa(empresaData).subscribe({
      next: () => {
        this.cargarEmpresas();
        this.nuevaEmpresa = { nombre: '', tipoServicio: '' };
      },
      error: err => console.error('Error al registrar empresa:', err)
    });
  }
   cerrarSesion(): void {
  localStorage.clear(); // Elimina token, userId, rol, etc.
  this.router.navigate(['/login']);
}

verAgrupadasPorEmpresa(): void {
  this.adminService.getQuejasAgrupadasPorEmpresa().subscribe({
    next: data => {
      this.quejasAgrupadas = data;
    this.empresasUnicas = [...new Set(
  data
    .filter(q => q.empresa && q.empresa.nombre)
    .map(q => q.empresa.nombre)
)];
console.log('Quejas agrupadas:', data);
console.log('Empresas en agrupadas:', data.map(q => q.empresa));

      this.empresaSeleccionada = this.empresasUnicas[0];
      console.log('[ADMIN] Quejas agrupadas por empresa:', data);
    },
    error: err => {
      console.error('Error al obtener quejas agrupadas:', err);
    }
  });
}
get quejasFiltradasPorEmpresa(): any[] {
  return this.quejasAgrupadas.filter(q => q.empresa?.nombre === this.empresaSeleccionada);
}



}
