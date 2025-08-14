import { Component } from '@angular/core';
import { ListaClientes } from "../../components/lista-clientes/lista-clientes";
import { ListaFornecedores } from "../../components/lista-fornecedores/lista-fornecedores";

@Component({
  selector: 'app-pagina-cadastros',
  imports: [ListaClientes, ListaFornecedores],
  templateUrl: './pagina-cadastros.html',
  styleUrl: './pagina-cadastros.scss',
})
export class PaginaCadastros {
}
