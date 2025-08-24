import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ProdutoModel } from '../models/produto.model';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrlProduto = `${environment.apiUrl}/produtos`;

  getProdutos(
    page: number,
    size: number,
    filtros: { fornecedorId?: number; status?: string } = {}
  ): Observable<RespostaPaginada<ProdutoModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros.fornecedorId) {
      params = params.set('fornecedorId', filtros.fornecedorId.toString());
    }
    if (filtros.status) {
      params = params.set('status', filtros.status);
    }

    return this.http.get<RespostaPaginada<ProdutoModel>>(this.apiUrlProduto, {
      params,
    });
  }

  getById(id: number): Observable<ProdutoModel> {
    return this.http.get<ProdutoModel>(`${this.apiUrlProduto}/${id}`);
  }

  addProduto(produto: ProdutoModel): Observable<ProdutoModel> {
    const payload = {
      ...produto,
      codigoFornecedor: undefined,
      idReferencia: produto.idReferencia,
    };
    return this.http.post<ProdutoModel>(this.apiUrlProduto, payload);
  }
  updateProduto(id: number, produto: ProdutoModel): Observable<ProdutoModel> {
    const payload = {
      ...produto,
      codigoFornecedor: undefined,
      idReferencia: produto.idReferencia,
    };
    return this.http.put<ProdutoModel>(`${this.apiUrlProduto}/${id}`, payload);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProduto}/${id}`);
  }
}
