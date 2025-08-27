import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { SegmentedControl, SegmentedOption } from '@modules/inventario';
import { AnaliseService, PeriodoAnalise } from '@modules/inicio/services/analise.service';
import { NotificacaoService } from '@core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-analise-lucro',
  imports: [SegmentedControl, CurrencyPipe],
  templateUrl: './analise-lucro.html',
  styleUrl: './analise-lucro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnaliseLucro {
  private analiseService = inject(AnaliseService);
  private notificacaoService = inject(NotificacaoService);
  // Opções do controle segmentado: Dia, Semana, Mês
  protected readonly periodos: SegmentedOption[] = [
    { id: 1, nome: 'Dia' },
    { id: 2, nome: 'Semana' },
    { id: 3, nome: 'Mês' },
  ];

  // Estado do período ativo
  protected readonly periodoAtivoId = signal<number>(1);
  protected readonly lucro = signal<number | null>(null);
  protected readonly isLoading = signal<boolean>(false);

  protected onPeriodoSelect(id: number) {
    this.periodoAtivoId.set(id);
    // handled by effect
  }

  constructor() {
    // Carregar quando o período mudar
    effect(() => {
      const id = this.periodoAtivoId();
      const periodo = this.mapIdToPeriodo(id);
      this.buscarLucro(periodo);
    });
  }

  private mapIdToPeriodo(id: number): PeriodoAnalise {
    switch (id) {
      case 1:
        return 'DIA';
      case 2:
        return 'SEMANA';
      case 3:
      default:
        return 'MES';
    }
  }

  private buscarLucro(periodo: PeriodoAnalise) {
    this.isLoading.set(true);
    this.lucro.set(null);
    this.analiseService.getLucro(periodo).subscribe({
      next: (res) => {
        this.lucro.set(res.totalLucro ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificacaoService.mostrarNotificacao('Não foi possível carregar a análise de lucro.', 'error');
      }
    });
  }
}
