import { Component, input, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ProdutoModel } from '../../models/produto.model';
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

  acabamentoImagens: { [key: number]: string } = {
    0: 'assets/acabamentos/dourado.png',
    1: 'assets/acabamentos/banho-dourado.png',
    2: 'assets/acabamentos/prata.png',
    3: 'assets/acabamentos/banho-prata.png',
    4: 'assets/acabamentos/aco.png',
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
