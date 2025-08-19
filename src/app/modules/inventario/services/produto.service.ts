import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { FornecedorModel } from '../../cadastros/models/fornecedor.model';
import { ProdutoModel } from '../models/produto.model';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrlFornecedor = 'https://gleam.up.railway.app/api/fornecedores';
  private apiUrlProduto = 'https://gleam.up.railway.app/api/produtos';

  constructor() { }

  getFornecedores(): Observable<FornecedorModel[]> {
    return this.http.get<FornecedorModel[]>(this.apiUrlFornecedor);
  }

  addProduto(produto: ProdutoModel): Observable<any> {
    console.log('Serviço: Enviando produto para a API...', produto);
    return this.http.post(this.apiUrlProduto, produto);
  }

  getProdutosPorFornecedor(fornecedorId: number): Observable<ProdutoModel[]> {
    const url = `${this.apiUrlProduto}/fornecedor/${fornecedorId}`;
    return this.http.get<RespostaPaginada<ProdutoModel>>(url).pipe(
      map(response => response.content)
    );
  }
}