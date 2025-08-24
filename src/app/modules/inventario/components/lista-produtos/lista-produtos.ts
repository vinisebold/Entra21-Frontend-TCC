import { Component, input, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ProdutoModel, type AcabamentoProduto } from '../../models/produto.model';
import { FormularioVenda } from '../formulario-venda/formulario-venda';

@Component({
  selector: 'app-lista-produtos',
  imports: [NgOptimizedImage, CurrencyPipe, FormularioVenda],
  templateUrl: './lista-produtos.html',
})
export class ListaProdutos {
  produtos = input.required<ProdutoModel[]>();
  isLoading = input<boolean>(false);
  erro = input<string | null>(null);
  mostrarModalVenda = signal(false);
  produtoSelecionado = signal<ProdutoModel | null>(null);

  acabamentoImagens: Record<AcabamentoProduto, string> = {
    DOURADO: 'assets/acabamentos/dourado.png',
    BANHO_DOURADO: 'assets/acabamentos/banho-dourado.png',
    PRATA: 'assets/acabamentos/prata.png',
    BANHO_PRATA: 'assets/acabamentos/banho-prata.png',
    ACO: 'assets/acabamentos/aco.png',
  };
  abrirVendaModal(produto: ProdutoModel): void {
    this.produtoSelecionado.set(produto);
    this.mostrarModalVenda.set(true);
  }
  closeVendaModal(): void {
    this.mostrarModalVenda.set(false);
    this.produtoSelecionado.set(null);
  }
}
