import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FornecedorModel } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private http = inject(HttpClient);
  private apiUrl = 'https://gleam.up.railway.app/api/fornecedores';

  getFornecedores(): Observable<FornecedorModel[]> {
    return this.http.get<FornecedorModel[]>(this.apiUrl);
  }

  addFornecedor(fornecedor: FornecedorModel): Observable<FornecedorModel> {
    return this.http.post<FornecedorModel>(this.apiUrl, fornecedor);
  }

  deleteFornecedor(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
