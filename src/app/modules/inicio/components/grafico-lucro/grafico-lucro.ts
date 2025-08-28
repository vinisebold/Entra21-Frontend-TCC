import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { LineChartModule, type Color, ScaleType } from '@swimlane/ngx-charts';
import { AnaliseService, PeriodoGrafico } from '@modules/inicio/services/analise.service';
import { NotificacaoService } from '@core';

@Component({
  selector: 'app-grafico-lucro',
  imports: [LineChartModule],
  templateUrl: './grafico-lucro.html',
  styleUrl: './grafico-lucro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoLucro {
  private analiseService = inject(AnaliseService);
  private notificacao = inject(NotificacaoService);
  // Input para controlar o período do gráfico: 'SEMANA' | 'MES' | 'ANO'
  readonly periodo = input<PeriodoGrafico>('SEMANA');

  // Dados do gráfico vindos da API
  protected readonly dados = signal<{ name: string; series: { name: string; value: number }[] }[]>([
    { name: 'Lucro', series: [] }
  ]);
  protected readonly isLoading = signal(false);

  // Opções do gráfico
  protected readonly legend = signal(false);
  protected readonly xAxis = signal(true);
  protected readonly yAxis = signal(true);
  protected readonly timeline = signal(false);
  protected readonly colorScheme: Color = {
    domain: ['#99A86C', '#99A86C', '#f59e0b', '#ef4444'],
  group: ScaleType.Ordinal,
    selectable: true,
    name: 'custom',
  };

  constructor() {
    // Recarrega o gráfico quando o período mudar
    effect(() => {
      const p = this.periodo();
      this.carregarGrafico(p);
    });
  }

  private carregarGrafico(periodo: PeriodoGrafico) {
    this.isLoading.set(true);
    this.analiseService.getLucroGrafico(periodo).subscribe({
      next: (lista) => {
        const series = lista.map((p) => ({ name: p.periodo, value: p.lucro ?? 0 }));
        this.dados.set([{ name: 'Lucro', series }]);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificacao.mostrarNotificacao('Falha ao carregar dados do gráfico de lucro.', 'error');
      }
    });
  }
}
