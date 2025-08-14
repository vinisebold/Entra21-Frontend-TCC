import { Component } from '@angular/core';
import { Botao } from '../../../../shared/components/botao/botao';
import { FormularioCliente } from '../../../cadastros/components/formulario-cliente/formulario-cliente';
import { FormularioFornecedor } from '../../../cadastros/components/formulario-fornecedor/formulario-fornecedor';

@Component({
  selector: 'app-pagina-cadastros',
  imports: [FormularioCliente, FormularioFornecedor, Botao],
  templateUrl: './pagina-cadastros.html',
  styleUrl: './pagina-cadastros.scss',
})
export class PaginaCadastros {
  // MODAL DO FORNECEDOR
  mostrarModalFornecedor = false;

  abrirFornecedorModal() {
    this.mostrarModalFornecedor = true;
  }

  closeFornecedorModal() {
    this.mostrarModalFornecedor = false;
  }

  // MODAL DO CLIENTE
  mostrarModalClient = false;

  abrirClientModal() {
    this.mostrarModalClient = true;
  }

  closeClientModal() {
    this.mostrarModalClient = false;
  }
}
