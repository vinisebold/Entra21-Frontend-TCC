import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-fornecedor',
  imports: [ ReactiveFormsModule ],
  templateUrl: './formulario-fornecedor.html',
  styleUrl: './formulario-fornecedor.scss',
})
export class FormularioFornecedor {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  onFecharClick(): void {
    this.fechar.emit();
  }

  onSalvarClick(): void {
    console.log('onSalvarClick pressed');


    this.salvo.emit();
  }
}
