import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LineChartModule, type Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grafico-lucro',
  imports: [LineChartModule],
  templateUrl: './grafico-lucro.html',
  styleUrl: './grafico-lucro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoLucro {
  // Dados estáticos de exemplo (serão substituídos pela API depois)
  protected readonly dados = signal([
    {
      name: 'Lucro',
      series: [
        { name: 'Jan', value: 12000 },
        { name: 'Fev', value: 9500 },
        { name: 'Mar', value: 14750 },
        { name: 'Abr', value: 13100 },
        { name: 'Mai', value: 16000 },
        { name: 'Jun', value: 17250 },
        { name: 'Jul', value: 15500 },
        { name: 'Ago', value: 18100 },
        { name: 'Set', value: 16900 },
        { name: 'Out', value: 19050 },
        { name: 'Nov', value: 21000 },
        { name: 'Dez', value: 23500 },
      ],
    },
  ]);

  // Opções do gráfico
  protected readonly legend = signal(false);
  protected readonly xAxis = signal(true);
  protected readonly yAxis = signal(true);
  protected readonly timeline = signal(false);
  protected readonly colorScheme: Color = {
    domain: ['#2563eb', '#22c55e', '#f59e0b', '#ef4444'],
  group: ScaleType.Ordinal,
    selectable: true,
    name: 'custom',
  };
}
