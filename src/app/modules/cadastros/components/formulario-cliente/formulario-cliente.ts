import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-formulario-cliente',
  imports: [],
  templateUrl: './formulario-cliente.html',
  styleUrl: './formulario-cliente.scss',
})
export class FormularioCliente {
  @Input() mostrar = false;
  @Output() fechar = new EventEmitter<void>();

  constructor() {}

  closeClientModal() {
    this.fechar.emit();
  }
}
