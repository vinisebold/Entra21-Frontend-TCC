import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaVendasPendentes } from '../../components/lista-vendas-pendentes/lista-vendas-pendentes';
import { ListaVendasQuitadas } from '../../components/lista-vendas-quitadas/lista-vendas-quitadas';
import { NotificacaoService } from '@core';
import { isOfflineError } from '@shared/utils/network';
import { VendaResponse, VendaService } from '@modules/inventario';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-controle-vendas',
  standalone: true,
  imports: [CommonModule, ListaVendasPendentes, ListaVendasQuitadas],
  templateUrl: './controle-vendas.html',
  styleUrl: './controle-vendas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControleVendas {
  private vendaService = inject(VendaService);
  private notificacao = inject(NotificacaoService);

  isLoading = signal(false);
  vendasPendentes = signal<VendaResponse[]>([]);
  vendasPagas = signal<VendaResponse[]>([]);

  constructor() {
    this.carregarListas();
  }

  async carregarListas(): Promise<void> {
    this.isLoading.set(true);
    try {
      const [pendentes, pagas] = await Promise.all([
        firstValueFrom(this.vendaService.getVendas({ status: 'PENDENTE' })),
        firstValueFrom(this.vendaService.getVendas({ status: 'PAGO' })),
      ]);
      this.vendasPendentes.set(pendentes);
      this.vendasPagas.set(pagas);
    } catch (e: any) {
      if (isOfflineError(e)) {
        // mantém skeleton ativo
        return;
      }
      this.notificacao.mostrarNotificacao('Erro ao carregar vendas.', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onPagarParcela(id: number): Promise<void> {
    try {
      await firstValueFrom(this.vendaService.pagarParcela(id));
      this.notificacao.mostrarNotificacao(
        'Parcela paga com sucesso.',
        'success'
      );
      this.carregarListas();
    } catch (e: any) {
      const mensagem =
        e?.error?.message ||
        e?.error?.error ||
        e?.message ||
        'Falha ao pagar parcela.';
      this.notificacao.mostrarNotificacao(mensagem, 'error');
    }
  }

  async onCancelar(id: number): Promise<void> {
    try {
      await firstValueFrom(this.vendaService.cancelarVenda(id));
      this.notificacao.mostrarNotificacao('Venda cancelada.', 'success');
      this.carregarListas();
    } catch (e: any) {
      const mensagem =
        e?.error?.message ||
        e?.error?.error ||
        e?.message ||
        'Falha ao cancelar venda.';
      this.notificacao.mostrarNotificacao(mensagem, 'error');
    }
  }

  // Registro de vendas acontece apenas via Inventário
}
