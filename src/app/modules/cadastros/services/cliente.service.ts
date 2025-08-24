import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '@env/environment';
import { RespostaPaginada } from '@shared';
import { ClienteModel } from '../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  // Estado simples em português
  readonly clientes = signal<ClienteModel[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  // Carrega e atualiza os sinais
  listar(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http
      .get<RespostaPaginada<ClienteModel>>(this.apiUrl)
      .pipe(
        catchError(() => {
          this.erro.set('Erro ao carregar clientes');
          this.carregando.set(false);
          return of(null);
        })
      )
      .subscribe((resposta) => {
        if (resposta) {
          this.clientes.set(resposta.content);
        }
        this.carregando.set(false);
      });
  }

  // Método tradicional para compatibilidade (pode ser removido gradualmente)
  getClientes(): Observable<RespostaPaginada<ClienteModel>> {
    return this.http.get<RespostaPaginada<ClienteModel>>(this.apiUrl);
  }

  getById(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.apiUrl, cliente).pipe(
      map((novo) => {
        this.clientes.update((lista) => [...lista, novo]);
        return novo;
      }),
      catchError((erro) => {
        this.erro.set('Erro ao adicionar cliente');
        throw erro;
      })
    );
  }

  updateCliente(id: number, cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.put<ClienteModel>(`${this.apiUrl}/${id}`, cliente).pipe(
      map((atualizado) => {
        this.clientes.update((lista) =>
          lista.map((c) => (c.id === id ? atualizado : c))
        );
        return atualizado;
      }),
      catchError((erro) => {
        this.erro.set('Erro ao atualizar cliente');
        throw erro;
      })
    );
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        this.clientes.update((lista) => lista.filter((c) => c.id !== id));
      }),
      catchError((erro) => {
        this.erro.set('Erro ao deletar cliente');
        throw erro;
      })
    );
  }

  // Limpa o estado local
  limparEstado(): void {
    this.clientes.set([]);
    this.erro.set(null);
    this.carregando.set(false);
  }
}