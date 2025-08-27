import { Component } from '@angular/core';
import { AnaliseLucro } from '../../components/analise-lucro/analise-lucro' 
import { GraficoProduto } from '../../components/grafico-produto/grafico-produto';

@Component({
  selector: 'app-pagina-inicio',
  imports: [AnaliseLucro, GraficoProduto],
  templateUrl: './pagina-inicio.html',
  styleUrl: './pagina-inicio.scss'
})
export class PaginaInicio {

}
