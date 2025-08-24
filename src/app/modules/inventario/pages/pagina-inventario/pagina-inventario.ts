import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';

import { Botao } from '../../../../shared/components/botao/botao';
import { SegmentedControl, FormularioProduto, ProdutoService, ProdutoModel } from '@modules/inventario';
import { FornecedorModel, FornecedorService } from '@modules/cadastros';
import { firstValueFrom } from 'rxjs';
import { ListaProdutos } from '../../components/lista-produtos/lista-produtos';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacaoService } from '@core';

@Component({
  selector: 'app-pagina-inventario',
  imports: [SegmentedControl, ListaProdutos, FormularioProduto, Botao],
  templateUrl: './pagina-inventario.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaInventario {
  private fornecedorService = inject(FornecedorService);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificacaoService = inject(NotificacaoService);

  // Estado gerenciado por Signals
  fornecedores = signal<FornecedorModel[]>([]);
  produtos = signal<ProdutoModel[]>([]);
  fornecedorSelecionadoId = signal<number | null>(null);
  isLoadingProdutos = signal(false);

  produtoParaEditar = signal<ProdutoModel | null>(null);
  isModalProdutoAberto = signal(false);

  constructor() {
    this.carregarFornecedores();
    this.observarMudancasDeRota();
    // Efeito para buscar produtos sempre que o fornecedor mudar
    effect(() => {
      const id = this.fornecedorSelecionadoId();
      if (id !== null) {
        this.carregarProdutos(id);
      } else {
        this.produtos.set([]); // Limpa a lista se nenhum fornecedor estiver selecionado
      }
    });
  }

  private async carregarFornecedores(): Promise<void> {
    this.isLoadingProdutos.set(true);
    try {
      const resposta = await firstValueFrom(
        this.fornecedorService.getFornecedores()
      );
      this.fornecedores.set(resposta.content);

      if (
        !this.route.snapshot.queryParams['fornecedor'] &&
        resposta.content.length > 0
      ) {
        this.onFornecedorSelecionado(resposta.content[0].id!);
      }
    } catch (error) {
      this.notificacaoService.mostrarNotificacao(
        'Erro ao carregar fornecedores.',
        'error'
      );
    } finally {
      this.isLoadingProdutos.set(false);
    }
  }

  private async carregarProdutos(fornecedorId: number): Promise<void> {
    try {
      const resposta = await firstValueFrom(
        this.produtoService.getProdutos(0, 50, {
          fornecedorId,
          status: 'EM_ESTOQUE',
        })
      );
      this.produtos.set(resposta.content);
    } catch (error) {
      this.notificacaoService.mostrarNotificacao(
        'Erro ao carregar produtos.',
        'error'
      );
    }
  }

  private observarMudancasDeRota(): void {
    const fornecedorId = this.route.snapshot.queryParams['fornecedor'];
    if (fornecedorId) {
      this.fornecedorSelecionadoId.set(Number(fornecedorId));
    }
  }

  onFornecedorSelecionado(fornecedorId: number | null): void {
    if (fornecedorId === null) return;
    this.fornecedorSelecionadoId.set(fornecedorId);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { fornecedor: fornecedorId },
      queryParamsHandling: 'merge',
    });
  }

  abrirModalProduto(produto: ProdutoModel | null = null): void {
    this.produtoParaEditar.set(produto);
    this.isModalProdutoAberto.set(true);
  }

  fecharModalProduto(): void {
    this.isModalProdutoAberto.set(false);
    this.produtoParaEditar.set(null);
  }

  onSucessoFormulario(): void {
    const id = this.fornecedorSelecionadoId();
    if (id) {
      this.carregarProdutos(id); // Recarrega a lista
    }
    this.fecharModalProduto();
  }
}
