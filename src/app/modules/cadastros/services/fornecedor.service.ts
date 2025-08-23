import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FornecedorModel } from '../models/fornecedor.model';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private apiUrl = `${environment.apiUrl}/fornecedores`;

constructor(private http: HttpClient) {}

  getFornecedores(): Observable<RespostaPaginada<FornecedorModel>> {
    return this.http.get<RespostaPaginada<FornecedorModel>>(this.apiUrl);
  }

  addFornecedor(fornecedor: FornecedorModel): Observable<FornecedorModel> {
    return this.http.post<FornecedorModel>(this.apiUrl, fornecedor);
  }

  deleteFornecedor(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
