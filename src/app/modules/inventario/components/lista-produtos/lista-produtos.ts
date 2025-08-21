import { Component, input } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ProdutoModel } from '../../models/produto.model';

@Component({
  selector: 'app-lista-produtos',
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './lista-produtos.html'
})
export class ListaProdutos {
  produtos = input.required<ProdutoModel[]>();
  isLoading = input<boolean>(false);
  erro = input<string | null>(null);

  acabamentoImagens: { [key: number]: string } = {
    0: 'assets/acabamentos/dourado.png',
    1: 'assets/acabamentos/banho-dourado.png',
    2: 'assets/acabamentos/prata.png',
    3: 'assets/acabamentos/banho-prata.png',
    4: 'assets/acabamentos/aco.png',
  };
}
