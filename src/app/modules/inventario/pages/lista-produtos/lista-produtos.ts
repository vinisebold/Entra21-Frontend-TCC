import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Botao } from "../../../../shared/components/botao/botao";
import { SegmentedControl } from "../../components/segmented-control/segmented-control";


@Component({
  selector: 'app-lista-produtos',
  imports: [ Botao, SegmentedControl],
  templateUrl: './lista-produtos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProdutos {

}
