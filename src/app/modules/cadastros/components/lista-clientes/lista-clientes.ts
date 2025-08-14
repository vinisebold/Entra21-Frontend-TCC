import { Component } from '@angular/core';
import { FormularioCliente } from '../../../cadastros/components/formulario-cliente/formulario-cliente';
import { Botao } from '../../../../shared/components/botao/botao';

@Component({
  selector: 'app-lista-clientes',
  imports: [FormularioCliente, Botao],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.scss',
})
export class ListaClientes {
  // MODAL DO CLIENTE
  mostrarModalClient = false;

  abrirClientModal() {
    this.mostrarModalClient = true;
  }

  closeClientModal() {
    this.mostrarModalClient = false;
  }
}
