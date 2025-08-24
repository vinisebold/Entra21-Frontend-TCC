import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { FornecedorModel } from '../models/fornecedor.model';
import { RespostaPaginada } from '../../../shared/models/resposta-paginada';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private apiUrl = `${environment.apiUrl}/fornecedores`;

  constructor(private http: HttpClient) {}

  // Estado simples em português
  readonly fornecedores = signal<FornecedorModel[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  listar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.http
      .get<RespostaPaginada<FornecedorModel>>(this.apiUrl)
      .pipe(
        catchError(() => {
          this.erro.set('Erro ao carregar fornecedores');
          this.carregando.set(false);
          return of(null);
        })
      )
      .subscribe((resposta) => {
        if (resposta) {
          this.fornecedores.set(resposta.content);
        }
        this.carregando.set(false);
      });
  }

  getFornecedores(): Observable<RespostaPaginada<FornecedorModel>> {
    return this.http.get<RespostaPaginada<FornecedorModel>>(this.apiUrl);
  }

  addFornecedor(fornecedor: FornecedorModel): Observable<FornecedorModel> {
    return this.http.post<FornecedorModel>(this.apiUrl, fornecedor).pipe(
      map((novo) => {
        this.fornecedores.update((lista) => [...lista, novo]);
        return novo;
      })
    );
  }

  deleteFornecedor(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.fornecedores.update((lista) =>
          lista.filter((f) => f.id !== Number(id))
        );
      })
    );
  }
}
