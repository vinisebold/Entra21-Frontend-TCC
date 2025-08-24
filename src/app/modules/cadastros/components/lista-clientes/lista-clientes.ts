import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Botao } from '../../../../shared/components/botao/botao';
import { FormularioCliente } from '../../../cadastros/components/formulario-cliente/formulario-cliente';
import { ClienteItem } from '../cliente-item/cliente-item';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-lista-clientes',
  imports: [FormularioCliente, Botao, ClienteItem],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaClientes {
  private clienteService = inject(ClienteService);
  
  // Acesso reativo aos dados do serviço
  readonly clientes = this.clienteService.clientes;
  readonly carregando = this.clienteService.carregando;
  readonly erro = this.clienteService.erro;
  
  // Estado local do componente
  readonly mostrarModalCliente = signal(false);
  
  // Mensagem de feedback removida a pedido; mantemos apenas estados e a lista

  constructor() {
  // Carrega os dados automaticamente quando o componente é criado
  this.clienteService.listar();
  }

  // Método para recarregar dados manualmente
  carregarClientes(): void {
    this.clienteService.listar();
  }

  // Método reativo para deletar cliente
  deletarCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        // O estado é atualizado automaticamente pelo serviço
        console.log('Cliente deletado com sucesso');
      },
      error: (error) => {
        console.error('Erro ao deletar cliente:', error);
      }
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
    // Não é mais necessário recarregar manualmente - o estado é atualizado automaticamente
  }
}
