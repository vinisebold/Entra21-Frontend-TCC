import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ProdutoModel } from '../models/produto.model';
import { RespostaPaginada } from '@shared';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrlProduto = `${environment.apiUrl}/produtos`;

  getProdutos(
    page: number,
    size: number,
    filtros: { fornecedorId?: number; status?: string } = {},
    ordenacao?: { campo: string; direcao: 'asc' | 'desc' }
  ): Observable<RespostaPaginada<ProdutoModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros.fornecedorId) {
      // Backend may accept either 'fornecedor' or 'fornecedorId' – send both for compatibility
      params = params
        .set('fornecedorId', filtros.fornecedorId.toString())
        .set('fornecedor', filtros.fornecedorId.toString());
    }
    if (filtros.status) {
      params = params.set('status', filtros.status);
    }

    if (ordenacao && ordenacao.campo && ordenacao.direcao) {
      params = params.set('sort', `${ordenacao.campo},${ordenacao.direcao}`);
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
  dataCriacao: undefined,
    };
    return this.http.post<ProdutoModel>(this.apiUrlProduto, payload);
  }
  updateProduto(id: number, produto: ProdutoModel): Observable<ProdutoModel> {
    const payload = {
      ...produto,
      codigoFornecedor: undefined,
      idReferencia: produto.idReferencia,
  dataCriacao: undefined,
    };
    return this.http.put<ProdutoModel>(`${this.apiUrlProduto}/${id}`, payload);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlProduto}/${id}`);
  }
}
