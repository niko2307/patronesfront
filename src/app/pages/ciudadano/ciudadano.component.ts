import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CiudadanoService } from './ciudadano.service';
import { Router } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-ciudadano-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ciudadano.component.html',
  styleUrl: './ciudadano.component.scss'
})
export class CiudadanoComponent implements OnInit {
  activeSection: string = 'registrar';
  quejas: any[] = [];
  historial: any[] = [];
  empresas: any[] = [];
  usuarioId: number | null = null;

  nuevaQueja = {
    descripcion: '',
    empresaId: '',
  };

  mensajeExito: string = '';
  mostrarToast: boolean = false;

  constructor(private ciudadanoService: CiudadanoService,private router: Router) {}

  ngOnInit(): void {
    const id = localStorage.getItem('userId');
    console.log('[Init] localStorage userId:', id);
    if (id) {
      this.usuarioId = parseInt(id, 10);
      console.log('[Init] Parsed usuarioId:', this.usuarioId);
      this.scrollAnimaciones();
      this.obtenerMisQuejas();
      this.cargarEmpresas();
    } else {
      console.error('ID de usuario no encontrado en localStorage');
    }
  }

  scrollAnimaciones(): void {
    gsap.from('.ciudadano-menu', {
      duration: 1,
      y: -20,
      opacity: 0,
      ease: 'power3.out'
    });
    gsap.from('.seccion-activa', {
      duration: 1,
      y: 30,
      opacity: 0,
      delay: 0.2,
      ease: 'power2.out'
    });
  }

  cambiarSeccion(seccion: string): void {
    console.log('[Seccion] cambiando a:', seccion);
    this.activeSection = seccion;
    if (seccion === 'mis-quejas') {
      this.obtenerMisQuejas();
    }
    this.scrollAnimaciones();
  }

 registrarQueja(): void {
  if (!this.usuarioId || !this.nuevaQueja.empresaId) {
    alert('Debes seleccionar una empresa válida y estar autenticado.');
    return;
  }

  const payload = {
    descripcion: this.nuevaQueja.descripcion,
    empresaId: Number(this.nuevaQueja.empresaId),
    usuarioId: this.usuarioId,
    estado: 'ACTIVA',
    fechaRegistro: new Date().toISOString()
  };

  this.ciudadanoService.registrarQueja(payload).subscribe({
    next: (res) => {
      // ✅ Mostrar el vencimiento
      const vencimiento = new Date(res.vencimiento).toLocaleString('es-CO', {
        dateStyle: 'full', timeStyle: 'short'
      });

      this.mensajeExito = `✅ Queja registrada exitosamente. 
        📆 Vence: ${vencimiento}`;

      this.mostrarToast = true;
      this.nuevaQueja = { descripcion: '', empresaId: '' };
      this.cambiarSeccion('mis-quejas');
      setTimeout(() => this.mostrarToast = false, 6000);
    },
    error: err => {
      console.error('[Registrar] Error al registrar queja:', err);
      alert('Error al registrar queja: ' + err.message);
    }
  });
}



  obtenerMisQuejas(): void {
    if (!this.usuarioId) return;
    console.log('[Obtener] Quejas para usuarioId:', this.usuarioId);

    this.ciudadanoService.obtenerMisQuejas(this.usuarioId).subscribe({
      next: (data) => {
        console.log('[Obtener] Quejas cargadas:', data);
        this.quejas = data;
      },
      error: err => console.error('Error al cargar quejas:', err)
    });
  }

  verHistorial(quejaId: number): void {
    console.log('[Historial] Ver historial para quejaId:', quejaId);
    this.ciudadanoService.verHistorial(quejaId).subscribe({
      next: (data) => {
        console.log('[Historial] Datos cargados:', data);
        this.historial = data;
      },
      error: err => console.error('Error al cargar historial:', err)
    });
  }

  cargarEmpresas(): void {
    console.log('[Empresas] Cargando empresas...');
    this.ciudadanoService.getEmpresas().subscribe({
      next: (data) => {
        console.log('[Empresas] Empresas cargadas:', data);
        this.empresas = data;
      },
      error: err => console.error('Error al cargar empresas:', err)
    });
  }

 cerrarSesion(): void {
  localStorage.clear(); // Elimina token, userId, rol, etc.
  this.router.navigate(['/login']);
}
}