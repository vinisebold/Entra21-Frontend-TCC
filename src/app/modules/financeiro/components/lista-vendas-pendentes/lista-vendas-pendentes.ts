import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendaResponse } from '@modules/inventario';

@Component({
  selector: 'app-lista-vendas-pendentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-vendas-pendentes.html',
  styleUrl: './lista-vendas-pendentes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaVendasPendentes {
  vendas = input.required<VendaResponse[]>();
  isLoading = input<boolean>(false);
  pagarParcela = output<number>();
  cancelar = output<number>();
}
