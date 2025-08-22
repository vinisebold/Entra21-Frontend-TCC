import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Botao } from "../../../../shared/components/botao/botao";
import { SegmentedControl } from "../../components/segmented-control/segmented-control";
import { FormularioProduto } from "../../components/formulario-produto/formulario-produto";
import { ProdutoService } from '../../services/produto.service';
import { FornecedorModel } from '../../../cadastros/models/fornecedor.model';
import { ProdutoModel } from '../../models/produto.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ListaProdutos } from "../../components/lista-produtos/lista-produtos";

@Component({
  selector: 'app-pagina-inventario',
  imports: [SegmentedControl, ListaProdutos, FormularioProduto, Botao],
  templateUrl: './pagina-inventario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaInventario implements OnInit {
  private produtoService = inject(ProdutoService);

  // --- State Signals ---
  fornecedores = signal<FornecedorModel[]>([]);
  fornecedorSelecionadoId = signal<number | null>(null);
  produtos = signal<ProdutoModel[]>([]);
  isLoadingProdutos = signal(true);
  mostrarModalProduto = signal(false);
  erroProdutos = signal<string | null>(null);

  private fornecedorSelecionado$ = toObservable(this.fornecedorSelecionadoId);

  constructor() {
    this.fornecedorSelecionado$.pipe(
      tap(() => {
        this.isLoadingProdutos.set(true);
        this.erroProdutos.set(null);
        this.produtos.set([]);
      }),
      switchMap(id => {
        if (id === null) return of([]);
        return this.produtoService.getProdutosPorFornecedor(id).pipe(
          // CAPTURA ERROS DA API
          catchError(err => {
            console.error('Erro ao buscar produtos:', err);
            this.erroProdutos.set('Não foi possível carregar os produtos. Tente novamente mais tarde.');
            return of([]);
          })
        );
      })
    ).subscribe(produtos => {
      this.produtos.set(produtos);
      this.isLoadingProdutos.set(false);
    });
  }

  ngOnInit(): void {
    this.produtoService.getFornecedores().subscribe(fornecedores => {
      this.fornecedores.set(fornecedores);
      if (fornecedores.length > 0) {
        this.onFornecedorSelecionado(fornecedores[0].id);
      }
    });
  }

  // --- Event Handlers ---
  onFornecedorSelecionado(id: number): void {
    this.fornecedorSelecionadoId.set(id);
  }

  abrirProdutoModal(): void {
    this.mostrarModalProduto.set(true);
  }

  closeProdutoModal(): void {
    this.mostrarModalProduto.set(false);
    this.fornecedorSelecionadoId.set(this.fornecedorSelecionadoId());
  }
}
