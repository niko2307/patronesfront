import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios por email (según backend)
  getUsuariosPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/buscar?email=${email}`);
  }

  // Obtener todas las empresas vigiladas
  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empresas`);
  }

  // Registrar una nueva empresa
  registrarEmpresa(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/empresas/registrar`, data, { headers });
  }

  // Obtener todas las quejas
  getQuejas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quejas`);
  }

  // Obtener queja por ID
  getQuejaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/quejas/${id}`);
  }

  // Obtener historial de una queja por ID
  getHistorialPorQueja(idQueja: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/historial/queja/${idQueja}`);
  }

  // Registrar historial de una queja
  registrarHistorial(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/historial/registrar`, data, { headers });
  }

  // Cambiar estado de una queja (registrando historial)
  cambiarEstadoQueja(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/historial/registrar`, data, { headers });
  }
}
