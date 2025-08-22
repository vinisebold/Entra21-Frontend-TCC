import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ClienteModel } from '../models/cliente.model';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://gleam.up.railway.app/api/clientes';

    getClientes(): Observable<ClienteModel[]> {
      return this.http.get<RespostaPaginada<ClienteModel>>(this.apiUrl).pipe(
        map(resposta => resposta.content || [])
      );
    }

  addCliente(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.apiUrl, cliente);
  }

  deleteCliente(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
