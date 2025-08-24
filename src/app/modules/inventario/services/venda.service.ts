import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// --- IMPORTS CORRIGIDOS ---
import { RegistrarVendaRequest, VendaResponse } from '../models/venda.model';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendas`;

  registrarVenda(payload: RegistrarVendaRequest): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(this.apiUrl, payload);
  }

  getVendas(): Observable<VendaResponse[]> {
    return this.http.get<VendaResponse[]>(this.apiUrl);
  }

  pagarParcela(vendaId: number): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(`${this.apiUrl}/${vendaId}/pagar-parcela`, {});
  }
}