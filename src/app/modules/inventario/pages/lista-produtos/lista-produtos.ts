import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormularioProduto } from '../../components/formulario-produto/formulario-produto';


@Component({
  selector: 'app-lista-produtos',
  imports: [FormularioProduto],
  templateUrl: './lista-produtos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaProdutos {

}
