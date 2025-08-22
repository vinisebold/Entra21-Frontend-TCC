import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FornecedorModel } from '../models/fornecedor.model';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private http = inject(HttpClient);
  private apiUrlFornecedor = 'https://gleam.up.railway.app/api/fornecedores';

  getFornecedores(): Observable<FornecedorModel[]> {
    return this.http.get<RespostaPaginada<FornecedorModel>>(this.apiUrlFornecedor).pipe(
      map(response => response.content || [])
    );
  }

  addFornecedor(fornecedor: FornecedorModel): Observable<FornecedorModel> {
    return this.http.post<FornecedorModel>(this.apiUrlFornecedor, fornecedor);
  }

  deleteFornecedor(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlFornecedor}/${id}`);
  }
}
