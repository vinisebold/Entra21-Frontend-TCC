import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-formulario-fornecedor',
  imports: [],
  templateUrl: './formulario-fornecedor.html',
  styleUrl: './formulario-fornecedor.scss',
})
export class FormularioFornecedor {
  @Input() mostrar = false;
  @Output() fechar = new EventEmitter<void>();

  constructor() {}

  closeFornecedorModal() {
    this.fechar.emit();
  }
}
