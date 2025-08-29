import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PieChartModule, type Color, ScaleType } from '@swimlane/ngx-charts';
import {
  EstoqueService,
  type ResumoCategoria,
} from '../../services/estoque.service';

@Component({
  selector: 'app-grafico-produto',
  imports: [PieChartModule, CurrencyPipe],
  templateUrl: './grafico-produto.html',
  styleUrl: './grafico-produto.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoProduto implements OnInit {
  private readonly estoqueService = inject(EstoqueService);

  // Dados remotos normalizados para o componente
  protected readonly categorias = signal<
    { name: string; quantidade: number; somaPreco: number }[]
  >([]);
  protected readonly carregando = signal<boolean>(true);
  protected readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    // Carrega dados na inicialização
    this.carregando.set(true);
    this.erro.set(null);
    this.estoqueService.getResumoPorCategoria().subscribe({
      next: (res: ResumoCategoria[]) => {
        // Mapeia API -> modelo local
        const mapped = res.map((r) => ({
          name: r.categoria,
          quantidade: r.quantidade,
          // API já retorna em reais; mantemos sem converter para centavos
          somaPreco: r.valorTotalCusto,
        }));
        this.categorias.set(mapped);
        this.page.set(0);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar o resumo de estoque.');
        this.carregando.set(false);
      },
    });
  }

  protected readonly pageSize = 3;
  protected readonly page = signal(0);

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

  // Header: mostra página atual/total de páginas
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.categorias().length / this.pageSize))
  );
  protected readonly paginaTexto = computed(
    () => `${this.page() + 1}/${this.totalPages()}`
  );

  // Lista exibida: exatamente os itens da página
  protected readonly itensVisiveis = computed(() => this.categoriasPagina());

  protected prev() {
    if (this.page() > 0) this.page.update((p) => p - 1);
  }
  protected next() {
    if (this.page() < this.totalPages() - 1) this.page.update((p) => p + 1);
  }
}
