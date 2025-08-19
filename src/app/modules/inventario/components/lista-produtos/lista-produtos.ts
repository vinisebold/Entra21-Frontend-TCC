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

  acabamentoImagens: { [key: string]: string } = {
    OURO_PURO: 'assets/acabamentos/dourado.png',
    BANHADO_OURO: 'assets/acabamentos/banho-dourado.png',
    PRATA_PURA: 'assets/acabamentos/prata.png',
    ACO: 'assets/acabamentos/aco.png',
    BANHADO_PRATA: 'assets/acabamentos/banho-prata.png',
  };
}
