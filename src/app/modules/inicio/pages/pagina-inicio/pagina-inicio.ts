import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { AnaliseLucro } from '../../components/analise-lucro/analise-lucro' 
import { GraficoProduto } from '../../components/grafico-produto/grafico-produto';
import { EstoqueService, type ResumoGlobal } from '../../services/estoque.service';

@Component({
  selector: 'app-pagina-inicio',
  imports: [AnaliseLucro, GraficoProduto],
  templateUrl: './pagina-inicio.html',
  styleUrl: './pagina-inicio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginaInicio implements OnInit {
  private readonly estoqueService = inject(EstoqueService);

  // Signals para o card "Estoque Atual"
  protected readonly quantidadeTotal = signal<number | null>(null);
  protected readonly valorTotalCusto = signal<number | null>(null);
  protected readonly carregandoResumo = signal<boolean>(true);
  protected readonly erroResumo = signal<string | null>(null);

  protected readonly valorTotalCustoFormatado = computed(() => {
    const v = this.valorTotalCusto();
    return v == null
      ? null
      : new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(v);
  });

  ngOnInit(): void {
    this.carregandoResumo.set(true);
    this.erroResumo.set(null);
    this.estoqueService.getResumoGlobal().subscribe({
      next: (res: ResumoGlobal) => {
        this.quantidadeTotal.set(res.quantidadeTotal);
        this.valorTotalCusto.set(res.valorTotalCusto);
        this.carregandoResumo.set(false);
      },
      error: () => {
        this.erroResumo.set('Não foi possível carregar o resumo do estoque.');
        this.carregandoResumo.set(false);
      },
    });
  }
}
