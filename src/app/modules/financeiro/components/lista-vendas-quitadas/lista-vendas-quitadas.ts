import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaResponse } from '@modules/inventario';

@Component({
  selector: 'app-lista-vendas-quitadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-vendas-quitadas.html',
  styleUrl: './lista-vendas-quitadas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaVendasQuitadas {
  vendas = input.required<VendaResponse[]>();
}
