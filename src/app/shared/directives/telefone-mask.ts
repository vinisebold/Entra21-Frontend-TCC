import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import IMask, { type InputMask as IMaskInstance } from 'imask';

@Directive({
  selector: '[appTelefoneMask]',
  host: {
    '[attr.inputmode]': "'tel'",
    '[attr.autocomplete]': "'tel-national'",
  },
})
export class TelefoneMask implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLInputElement>);
  private mask: IMaskInstance | null = null;

  ngOnInit(): void {
    const input = this.el.nativeElement;

    // Ex.: (11) 3456-7890 e (11) 93456-7890
    this.mask = IMask(input, {
      mask: [{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }],
      dispatch: (appended: string, dynamicMasked: unknown) => {
        const dm = dynamicMasked as any;
        const number = (dm.value + appended).replace(/\D/g, '');
        return dm.compiledMasks[number.length > 10 ? 1 : 0];
      },
    });
  }

  ngOnDestroy(): void {
    if (this.mask) {
      this.mask.destroy();
      this.mask = null;
    }
  }
}
