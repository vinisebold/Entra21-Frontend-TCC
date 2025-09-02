import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-botao',
  standalone: true,
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
  // Ícone do sprite a ser usado (ex: 'icon-check', 'icon-registrar')
  icon = input<string>('icon-adicionar');
  // Tipo do botão (button ou submit)
  type = input<'button' | 'submit'>('button');
  // Estado de carregamento e rótulo opcional durante o loading
  loading = input<boolean>(false);
  loadingLabel = input<string>('Carregando...');

  // --- Outputs ---
  // Evento emitido quando o botão é clicado.
  // O tipo é "void" pq não precisamos enviar nenhum dado, apenas notificar que o clique aconteceu.
  buttonClick = output<void>();

  // Este método é chamado quando o elemento <button> do template é clicado.
  onClick(): void {
    // Evita emitir clique se estiver desabilitado ou em loading (o próprio [disabled] já cobre, mas por segurança)
    if (this.disabled() || this.loading()) return;
    this.buttonClick.emit();
  }
}
