import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { SegmentedControl, SegmentedOption } from '@modules/inventario';
import {
  AnaliseService,
  PeriodoAnalise,
} from '@modules/inicio/services/analise.service';
import { NotificacaoService } from '@core';
import { CurrencyPipe } from '@angular/common';
import { GraficoLucro } from "../grafico-lucro/grafico-lucro";

@Component({
  selector: 'app-analise-lucro',
  imports: [SegmentedControl, CurrencyPipe, GraficoLucro],
  templateUrl: './analise-lucro.html',
  styleUrl: './analise-lucro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnaliseLucro {
  private analiseService = inject(AnaliseService);
  private notificacaoService = inject(NotificacaoService);
  // Único controle segmentado (SEMANA, MES, ANO)
  protected readonly periodosGrafico: SegmentedOption[] = [
    { id: 1, nome: 'Semana' },
    { id: 2, nome: 'Mês' },
    { id: 3, nome: 'Ano' },
  ];

  // Estado do período ativo (controla gráfico e o card)
  protected readonly lucro = signal<number | null>(null);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly periodoGraficoAtivoId = signal<number>(1);

  protected onPeriodoGraficoSelect(id: number) {
    this.periodoGraficoAtivoId.set(id);
  }

  constructor() {
    // Carregar quando o período (único) mudar
    effect(() => {
      const id = this.periodoGraficoAtivoId();
      const periodoGrafico = this.mapIdToPeriodoGrafico(id);
      this.buscarLucroTotal(periodoGrafico);
    });
  }

  private buscarLucroTotal(periodo: 'SEMANA' | 'MES' | 'ANO') {
    this.isLoading.set(true);
    this.lucro.set(null);
    if (periodo === 'ANO') {
      // Não há endpoint de total anual; somamos os pontos do gráfico anual
      this.analiseService.getLucroGrafico('ANO').subscribe({
        next: (pontos) => {
          const total = pontos.reduce((sum, p) => sum + (p.lucro ?? 0), 0);
          this.lucro.set(total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notificacaoService.mostrarNotificacao(
            'Não foi possível carregar a análise de lucro anual.',
            'error'
          );
        },
      });
    } else {
      // Usa o endpoint de total para SEMANA e MES
      const periodoTotal: PeriodoAnalise = periodo; // compatível
      this.analiseService.getLucro(periodoTotal).subscribe({
        next: (res) => {
          this.lucro.set(res.totalLucro ?? 0);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notificacaoService.mostrarNotificacao(
            'Não foi possível carregar a análise de lucro.',
            'error'
          );
        },
      });
    }
  }

  // Mapeia id do segmented para o período aceito pelo endpoint de gráfico
  protected mapIdToPeriodoGrafico(id: number): 'SEMANA' | 'MES' | 'ANO' {
    switch (id) {
      case 1:
        return 'SEMANA';
      case 2:
        return 'MES';
      case 3:
      default:
        return 'ANO';
    }
  }
}
