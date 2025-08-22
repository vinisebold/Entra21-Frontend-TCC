import { inject, Injectable } from '@angular/core';
import { RegistrarVendaPayload, VendaRecibo } from '../models/venda.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://gleam.up.railway.app/api/itens-vendidos';

  registrarVenda(
    produtoId: number,
    detalhesVenda: RegistrarVendaPayload
  ): Observable<VendaRecibo> {
    const url = `${this.apiUrl}/vender/${produtoId}`;

    console.log(`Enviando POST para: ${url}`, detalhesVenda);

    return this.http.post<VendaRecibo>(url, detalhesVenda);
  }
}
