import { Component, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  ProdutoModel,
  type AcabamentoProduto,
  VendaResponse,
} from '@modules/inventario';
import { FormularioVenda } from '../formulario-venda/formulario-venda';

@Component({
  selector: 'app-lista-produtos',
  imports: [CurrencyPipe, FormularioVenda],
  templateUrl: './lista-produtos.html',
})
export class ListaProdutos {
  produtos = input.required<ProdutoModel[]>();
  isLoading = input<boolean>(false);
  erro = input<string | null>(null);
  mostrarModalVenda = signal(false);
  produtoSelecionado = signal<ProdutoModel | null>(null);
  vendaConcluida = output<VendaResponse>();

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

  onVendaRegistrada(venda: VendaResponse): void {
    this.mostrarModalVenda.set(false);
    this.produtoSelecionado.set(null);
    this.vendaConcluida.emit(venda);
  }

  private fromLocalDateTimeArray(arr: any): Date | null {
    if (!Array.isArray(arr) || arr.length < 6) return null;
    const [y, m, d, h, min, s, nano = 0] = arr as number[];
    const ms = Math.floor(nano / 1_000_000);
    return new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, min ?? 0, s ?? 0, ms);
  }

  formatDataCriacao(date?: string | any | null): string {
    if (!date) return '-';
    const parsed = Array.isArray(date) ? this.fromLocalDateTimeArray(date) : new Date(date);
    if (!parsed || isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
