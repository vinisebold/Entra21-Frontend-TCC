import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PieChartModule, type Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grafico-produto',
  imports: [PieChartModule],
  templateUrl: './grafico-produto.html',
  styleUrl: './grafico-produto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoProduto {
  // Dados estáticos para o estoque por peça
  protected readonly dados = signal([
    { name: 'Anel', value: 200 },
    { name: 'Berloque', value: 150 },
    { name: 'Bracelete', value: 120 },
    { name: 'Pingente', value: 90 },
  ]);

  // Paleta próxima ao visual já usado na página (tons de verde)
  protected readonly colorScheme: Color = {
    domain: ['#99A86C', '#BCC89A', '#CFDAB3', '#7B8A52'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'estoque-produto',
  };

  // Formatters (legenda/tooltip)
  protected valueFormat = (value: number) => `${value} peças`;
  protected percentFormat = (value: number) => `${value.toFixed(0)}%`;
}
