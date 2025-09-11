import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-numero-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-stretch rounded-xl overflow-hidden ring-1 ring-[var(--color-surface-container2)] bg-[var(--color-surface)]"
    >
      <button
        type="button"
        (click)="decrementar()"
        [disabled]="disabled || valor <= min"
        class="w-16 h-10 grid place-items-center text-[var(--color-on-surface-variant)] disabled:opacity-40 hover:bg-[var(--color-surface-container2)] focus:outline-none"
      >
        −
      </button>
      <input
        type="text"
        class="w-12 h-10 text-center text-sm bg-transparent outline-none select-none"
        [value]="valor"
        (keydown)="bloquearDigitacao($event)"
        tabindex="-1"
        aria-label="Número de parcelas"
        readonly
      />
      <button
        type="button"
        (click)="incrementar()"
        [disabled]="disabled || valor >= max"
        class="w-16 h-10 grid place-items-center text-[var(--color-on-surface-variant)] disabled:opacity-40 hover:bg-[var(--color-surface-container2)] focus:outline-none"
      >
        +
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumeroStepperComponent {
  @Input() valor = 1;
  @Input() min = 1;
  @Input() max = 12;
  @Input() step = 1;
  @Input() disabled = false;
  @Output() valorChange = new EventEmitter<number>();

  private emitir(v: number) {
    this.valor = v;
    this.valorChange.emit(this.valor);
  }
  incrementar() {
    if (this.valor + this.step <= this.max) {
      this.emitir(this.valor + this.step);
    }
  }
  decrementar() {
    if (this.valor - this.step >= this.min) {
      this.emitir(this.valor - this.step);
    }
  }
  bloquearDigitacao(ev: KeyboardEvent) {
    ev.preventDefault();
  }
}
