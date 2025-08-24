import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';
import { ClienteModel } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  // Retorna a resposta paginada completa.
  getClientes(): Observable<RespostaPaginada<ClienteModel>> {
    return this.http.get<RespostaPaginada<ClienteModel>>(this.apiUrl);
  }

  getById(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.put<ClienteModel>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}