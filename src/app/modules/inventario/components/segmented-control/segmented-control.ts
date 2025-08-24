import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FornecedorModel } from '@modules/cadastros';

@Component({
  selector: 'app-segmented-control',
  imports: [],
  templateUrl: './segmented-control.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedControl {
  // API
  readonly opcoes = input.required<FornecedorModel[]>();
  readonly opcaoAtivaId = input<number | null>(null);
  readonly selecaoMudou = output<number>();

  // Posição ativa para o thumb (usado pelo CSS var --idx)
  readonly indiceAtivo = computed(() => {
    const pos = this.opcoes().findIndex(o => o.id === this.opcaoAtivaId());
    return pos >= 0 ? pos : 0;
  });

  onSelecao(id: number): void {
    if (id !== this.opcaoAtivaId()) this.selecaoMudou.emit(id);
  }
}
