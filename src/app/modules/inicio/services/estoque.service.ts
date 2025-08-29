import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface ResumoCategoria {
  categoria: string;
  quantidade: number;
  valorTotalCusto: number; // valores em moeda (R$)
}

export interface ResumoGlobal {
  quantidadeTotal: number;
  valorTotalCusto: number; // valores em moeda (R$)
}

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getResumoPorCategoria(): Observable<ResumoCategoria[]> {
    const url = `${this.baseUrl}/estoque/resumo-por-categoria`;
    return this.http.get<ResumoCategoria[]>(url);
  }

  getResumoGlobal(): Observable<ResumoGlobal> {
    const url = `${this.baseUrl}/estoque/resumo-global`;
    return this.http.get<ResumoGlobal>(url);
  }
}
