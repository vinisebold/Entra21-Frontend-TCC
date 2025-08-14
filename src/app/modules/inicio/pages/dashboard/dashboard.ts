import { Component } from '@angular/core';
import { FormularioCliente } from '../../../cadastros/components/formulario-cliente/formulario-cliente';
import { Botao } from '../../../../shared/components/botao/botao';
import { FormularioFornecedor } from "../../../cadastros/components/formulario-fornecedor/formulario-fornecedor";

@Component({
  selector: 'app-dashboard',
  imports: [FormularioCliente, Botao, FormularioFornecedor],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
