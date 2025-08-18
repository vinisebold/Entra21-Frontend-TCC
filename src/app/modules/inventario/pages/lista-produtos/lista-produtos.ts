import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Botao } from "../../../../shared/components/botao/botao";
import { SegmentedControl } from "../../components/segmented-control/segmented-control";
import { FormularioProduto } from "../../components/formulario-produto/formulario-produto";


@Component({
  selector: 'app-lista-produtos',
  imports: [Botao, SegmentedControl, FormularioProduto],
  templateUrl: './lista-produtos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProdutos {
  mostrarModalProduto = signal(false);

  abrirProdutoModal(): void {
    this.mostrarModalProduto.set(true);
  }

  closeProdutoModal(): void {
    this.mostrarModalProduto.set(false);
  }


}
