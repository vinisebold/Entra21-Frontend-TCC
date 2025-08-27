import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PieChartModule, type Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grafico-produto',
  imports: [PieChartModule, CurrencyPipe],
  templateUrl: './grafico-produto.html',
  styleUrl: './grafico-produto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoProduto {
  // Dataset estático (pode ser trocado por dados reais depois)
  // Cada categoria tem quantidade de peças e soma de preços (em centavos)
  protected readonly categorias = signal([
    { name: 'Anel', quantidade: 200, somaPreco: 35000 },
    { name: 'Berloque', quantidade: 150, somaPreco: 27000 },
    { name: 'Bracelete', quantidade: 120, somaPreco: 22000 },
    { name: 'Pingente', quantidade: 90, somaPreco: 18000 },
    { name: 'Berloque', quantidade: 190, somaPreco: 19000 },
    { name: 'Piercing', quantidade: 120, somaPreco: 12000 },
    { name: 'Colar', quantidade: 40, somaPreco: 8000 },
  ]);

  // Paginação de 3 em 3
  protected readonly pageSize = 3;
  protected readonly page = signal(0);

  // Slice atual conforme página
  protected readonly categoriasPagina = computed(() => {
    const start = this.page() * this.pageSize;
    return this.categorias().slice(start, start + this.pageSize);
  });

  // Dados do gráfico (donut) conforme a página atual
  protected readonly dadosGrafico = computed(() =>
    this.categoriasPagina().map((c) => ({ name: c.name, value: c.quantidade }))
  );

  // Paleta próxima ao visual já usado na página (tons de verde)
  protected readonly colorScheme: Color = {
    domain: ['#99A86C', '#BCC89A', '#CFDAB3', '#7B8A52'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'estoque-produto',
  };

  // As cores dos pontos na lista seguem o índice local da página, alinhado ao donut

  // Header: mostra página atual/total de páginas
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.categorias().length / this.pageSize)));
  protected readonly paginaTexto = computed(() => `${this.page() + 1}/${this.totalPages()}`);

  // Lista exibida: exatamente os itens da página
  protected readonly itensVisiveis = computed(() => this.categoriasPagina());

  protected prev() { if (this.page() > 0) this.page.update((p) => p - 1); }
  protected next() { if (this.page() < this.totalPages() - 1) this.page.update((p) => p + 1); }
}
