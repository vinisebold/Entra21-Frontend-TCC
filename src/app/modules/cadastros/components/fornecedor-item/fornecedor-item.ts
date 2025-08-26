import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FornecedorModel } from '@modules/cadastros';

@Component({
  selector: 'app-fornecedor-item',
  imports: [DatePipe],
  template: `
    <div class="title-medium text-on-surface">{{ fornecedor().nome }}</div>
    <div class="mb-4 body-large text-on-surface-variant">
      {{ fornecedor().descricao }}
    </div>
    <div class="mt-2 flex flex-col gap-1">
      <span
        class="inline-flex items-center gap-1.5 body-medium text-on-surface-variant"
      >
        <svg class="icone" aria-hidden="true" focusable="false">
          <use [attr.href]="'/sprite.svg#icon-phone'"></use>
        </svg>
        {{ fornecedor().telefone }}
      </span>
      <span
        class="inline-flex items-center gap-1.5 body-medium text-on-surface-variant"
      >
        <svg class="icone" aria-hidden="true" focusable="false">
          <use [attr.href]="'/sprite.svg#icon-identidade'"></use>
        </svg>
        {{ fornecedor().cnpj }}
      </span>
    </div>
    @if (fornecedor().dataCriacao || fornecedor().dataAtualizacao) {
      <div class="mt-4 text-xs text-on-surface-variant opacity-70 w-full text-right flex justify-end">
        @if (fornecedor().dataCriacao) {
          {{ fornecedor().dataCriacao | date: 'dd/MM/yy HH:mm' }}
        }
        @if (fornecedor().dataCriacao && fornecedor().dataAtualizacao) { | }
        @if (fornecedor().dataAtualizacao) {
          {{ fornecedor().dataAtualizacao | date: 'dd/MM/yy HH:mm' }}
        }
      </div>
    }
  `,
  styleUrl: './fornecedor-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FornecedorItem {
  fornecedor = input.required<FornecedorModel>();
}
