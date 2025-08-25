import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import IMask, { type InputMask as IMaskInstance } from 'imask';

@Directive({
  selector: '[appCpfMask]',
  host: {
    '[attr.inputmode]': "'numeric'",
  },
})
export class CpfMask implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLInputElement>);
  private mask: IMaskInstance | null = null;

  ngOnInit(): void {
    const input = this.el.nativeElement;

    // CPF: 000.000.000-00
    this.mask = IMask(input, {
      mask: '000.000.000-00',
      lazy: true,
    });
  }

  ngOnDestroy(): void {
    if (this.mask) {
      this.mask.destroy();
      this.mask = null;
    }
  }
}
