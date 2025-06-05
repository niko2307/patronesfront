import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  registrarQueja(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/quejas/registrar`, data, { headers });
  }

  obtenerMisQuejas(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quejas/usuario/${usuarioId}`);
  }

  verHistorial(quejaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/historial/queja/${quejaId}`);
  }

  getEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empresas`);
  }
}
