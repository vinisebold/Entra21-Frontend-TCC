import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// --- IMPORTS CORRIGIDOS ---
import {
  RegistrarVendaRequest,
  VendaResponse,
  StatusVenda,
} from '../models/venda.model';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vendas`;

  registrarVenda(payload: RegistrarVendaRequest): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(this.apiUrl, payload);
  }

  getVendas(filtros?: { status?: StatusVenda }): Observable<VendaResponse[]> {
    let params = new HttpParams();
    if (filtros?.status) {
      params = params.set('status', filtros.status);
    }
    return this.http
      .get<{ content: VendaResponse[] }>(this.apiUrl, { params })
      .pipe(map((res) => res.content ?? []));
  }

  pagarParcela(vendaId: number): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(
      `${this.apiUrl}/${vendaId}/pagar-parcela`,
      {}
    );
  }

  cancelarVenda(vendaId: number): Observable<VendaResponse> {
    return this.http.post<VendaResponse>(
      `${this.apiUrl}/${vendaId}/cancelar`,
      {}
    );
  }
}
