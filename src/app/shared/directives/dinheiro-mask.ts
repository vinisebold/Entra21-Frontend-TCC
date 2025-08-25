import { Directive, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import IMask, { type InputMask as IMaskInstance } from 'imask';

@Directive({
  selector: '[appDinheiroMask]',
  host: {
    // Mantém inputmode apropriado para teclado numérico em mobile
    '[attr.inputmode]': "'decimal'",
  },
})
export class DinheiroMaskTsDirective implements OnInit, OnDestroy {

  private el = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);
  private mask: IMaskInstance | null = null;

  ngOnInit(): void {
    const input = this.el.nativeElement;

    // Instancia uma máscara numérica pensada para BRL (sem prefixo R$ pois o layout já o exibe ao lado)
    this.mask = IMask(input, {
      mask: Number,
      // 2 casas decimais
      scale: 2,
      // separadores brasileiros
      thousandsSeparator: '.',
      radix: ',',
      mapToRadix: ['.'], // permite digitar ponto e converter para vírgula
      // comportamentos
      normalizeZeros: true,
      padFractionalZeros: true,
      // evita negativos por padrão (preço)
      signed: false,
      // opcionalmente limite mínimo
      min: 0,
    });

    // Garante disparo de evento input/blur coerente com Angular Forms ao aceitar valores programáticos
    this.mask.on('accept', () => {
      // IMask já atualiza o valor do input e emite 'input'; nada adicional necessário.
      // Mantemos o hook para futura extensão se precisarmos sincronizar com form control manualmente.
    });
  }

  ngOnDestroy(): void {
    if (this.mask) {
      this.mask.destroy();
      this.mask = null;
    }
  }
}
