import { Component } from '@angular/core';
import { FormularioFornecedor } from '../../../cadastros/components/formulario-fornecedor/formulario-fornecedor';
import { Botao } from '../../../../shared/components/botao/botao';

@Component({
  selector: 'app-lista-fornecedores',
  imports: [Botao, FormularioFornecedor],
  templateUrl: './lista-fornecedores.html',
  styleUrl: './lista-fornecedores.scss',
})
export class ListaFornecedores {
  // MODAL DO FORNECEDOR
  mostrarModalFornecedor = false;

  abrirFornecedorModal() {
    this.mostrarModalFornecedor = true;
  }

  closeFornecedorModal() {
    this.mostrarModalFornecedor = false;
  }
}
