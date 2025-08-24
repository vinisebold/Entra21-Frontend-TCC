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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaClientes implements OnInit {
  private clienteService = inject(ClienteService);
  clientes = signal<ClienteModel[]>([]);
  mostrarModalCliente = signal(false);

  // ngOnInit é chamado uma vez quando o componente é criado
  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe((dados) => {
      this.clientes.set(dados.content);
    });
  }

  deletarCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe(() => {
      this.clientes.update((lista: ClienteModel[]) =>
        lista.filter((f: ClienteModel) => f.id !== id)
      );
    });
  }

  // --- MÉTODOS PARA O MODAL ---
  abrirClienteModal(): void {
    this.mostrarModalCliente.set(true);
  }

  closeClienteModal(): void {
    this.mostrarModalCliente.set(false);
  }

  // Este método é chamado quando o formulário avisa que salvou um novo cliente
  onClienteSalvo(): void {
    this.closeClienteModal();
    this.carregarClientes();
  }
}
