import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-pessoa',
  // standalone padrão (não declarar standalone:true)
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-pessoa.html',
  styleUrl: './card-pessoa.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class CardPessoa {
  // Inputs simples. Defaults mínimos só para evitar undefined no template.
  readonly nome = input<string>('');
  readonly email = input<string>('');
  readonly telefone = input<string>('');
  readonly avatar = input<string>('');
  readonly githubUrl = input<string | null>(null);
  readonly linkedinUrl = input<string | null>(null);
  readonly contribuicoes = input<string[]>([]);
}
