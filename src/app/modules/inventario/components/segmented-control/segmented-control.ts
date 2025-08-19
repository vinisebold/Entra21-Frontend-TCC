import { Component, input, output } from '@angular/core';
import { FornecedorModel } from '../../../cadastros/models/fornecedor.model';

@Component({
  selector: 'app-segmented-control',
  imports: [],
  templateUrl: './segmented-control.html',
})
export class SegmentedControl {
  opcoes = input.required<FornecedorModel[]>();
  opcaoAtivaId = input<number | null>(null);
  selecaoMudou = output<number>();

  onSelecao(id: number): void {
    if (id !== this.opcaoAtivaId()) {
      this.selecaoMudou.emit(id);
    }
  }
}
