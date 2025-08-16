import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Botao } from '../../../../shared/components/botao/botao';
import { FormularioCliente } from '../../../cadastros/components/formulario-cliente/formulario-cliente';
import { ClienteItem } from '../cliente-item/cliente-item';
import { ClienteModel } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-lista-clientes',
  imports: [FormularioCliente, Botao, ClienteItem],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.scss',
})
export class ListaClientes {
  private clienteService = inject(ClienteService);
  clientes = signal<ClienteModel[]>([]);
  mostrarModalCliente = signal(false);

  // ngOnInit é chamado uma vez quando o componente é criado
  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe((dados) => {
      this.clientes.set(dados);
    });
  }

  // --- MÉTODOS PARA O MODAL ---
  abrirClienteModal(): void {
    this.mostrarModalCliente.set(true);
  }

  closeClienteModal(): void {
    this.mostrarModalCliente.set(false);
  }

  // Este método é chamado quando o formulário avisa que salvou um novo fornecedor
  onClienteSalvo(): void {
    this.closeClienteModal();
    this.carregarClientes();
  }
}
