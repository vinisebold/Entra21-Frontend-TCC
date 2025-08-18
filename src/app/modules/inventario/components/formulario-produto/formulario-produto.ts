import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-formulario-produto',
  imports: [],
  templateUrl: './formulario-produto.html',
  styleUrl: './formulario-produto.scss'
})
export class FormularioProduto {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();
  

  onFecharClick(): void {
    this.fechar.emit();
  }
}
