import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';

import { Botao } from '../../../../shared/components/botao/botao';
import { FormularioFornecedor } from '../../../cadastros/components/formulario-fornecedor/formulario-fornecedor';
import { FornecedorItem } from '../fornecedor-item/fornecedor-item';
import { FornecedorModel, FornecedorService } from '@modules/cadastros';

@Component({
  selector: 'app-lista-fornecedores',
  imports: [Botao, FormularioFornecedor, FornecedorItem],
  templateUrl: './lista-fornecedores.html',
  styleUrl: './lista-fornecedores.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaFornecedores {
  private fornecedorService = inject(FornecedorService);

  readonly fornecedores = this.fornecedorService.fornecedores;
  readonly carregando = this.fornecedorService.carregando;
  readonly erro = this.fornecedorService.erro;

  mostrarModalFornecedor = signal(false);

  constructor() {
    this.fornecedorService.listar();
  }

  carregarFornecedores(): void {
    this.fornecedorService.listar();
  }

  deletarFornecedor(id: number): void {
    this.fornecedorService.deleteFornecedor(id).subscribe();
  }

  // --- MÉTODOS PARA O MODAL ---
  abrirFornecedorModal(): void {
    this.mostrarModalFornecedor.set(true);
  }

  closeFornecedorModal(): void {
    this.mostrarModalFornecedor.set(false);
  }

  // Este método é chamado quando o formulário avisa que salvou um novo fornecedor
  onFornecedorSalvo(): void {
    this.closeFornecedorModal();
    // lista já atualiza pelo serviço ao adicionar
  }
}
