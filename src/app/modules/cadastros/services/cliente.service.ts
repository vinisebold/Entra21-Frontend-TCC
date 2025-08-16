import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteModel } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://gleam.up.railway.app/api/clientes';

  getClientes(): Observable<ClienteModel[]> {
    return this.http.get<ClienteModel[]>(this.apiUrl);
  }

  addCliente(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.apiUrl, cliente);
  }
}
