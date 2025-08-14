import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-botao',
  imports: [ CommonModule ],
  templateUrl: './botao.html',
  styleUrl: './botao.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Botao {
  // --- Inputs ---
  // O componente pai VAI PRECISAR fornecer um texto para o botão (por isso do .required)
  label = input.required<string>();
  disabled = input<boolean>(false);

  // --- Outputs ---
  // Evento emitido quando o botão é clicado.
  // O tipo é "void" pq não precisamos enviar nenhum dado, apenas notificar que o clique aconteceu.
  buttonClick = output<void>();

  // Este método é chamado quando o elemento <button> do template é clicado.
  onClick(): void {
    this.buttonClick.emit();
  }
}
