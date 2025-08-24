import { inject, Injectable } from '@angular/core';
import { RegistrarVendaRequest, VendaResponse } from '../models/venda.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://gleam.up.railway.app/api/produtos';

  registrarVenda(
    produtoId: number,
    detalhesVenda: RegistrarVendaRequest
  ): Observable<VendaResponse> {
    const url = `${this.apiUrl}/vender/${produtoId}`;
    console.log(`Enviando POST para a NOVA URL: ${url}`, detalhesVenda);
    return this.http.post<VendaResponse>(url, detalhesVenda);
  }
}
