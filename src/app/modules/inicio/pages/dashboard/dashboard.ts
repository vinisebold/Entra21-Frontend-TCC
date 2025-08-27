import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  // Mocked values only to compose the layout; replace when wiring real data
  protected readonly estoqueAtual = signal(231);
  protected readonly custoTotalEstoque = signal(6321.22);
  protected readonly lucroHoje = signal(1200);
}
