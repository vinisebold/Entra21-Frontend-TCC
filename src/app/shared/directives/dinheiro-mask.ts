import { Directive, ElementRef, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';

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

  ngOnInit(): void {
    const input = this.el.nativeElement;
    
    // Define valor inicial
    input.value = '0,00';
    
    // Remove listeners existentes para evitar conflitos
    this.setupEventListeners(input);
  }

  private setupEventListeners(input: HTMLInputElement): void {
    // Previne seleção de texto e posiciona c ursor no final
    const preventSelection = (e: Event) => {
      setTimeout(() => {
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }, 0);
    };

    // Handler para keydown - captura apenas dígitos e teclas especiais
    const onKeyDown = (e: KeyboardEvent) => {
      // Permite: Backspace, Delete, Tab, Escape, Enter, e setas
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
      ];

      if (allowedKeys.includes(e.key)) {
        return;
      }

      // Se não é um dígito, bloqueia
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // Processa o dígito
      e.preventDefault();
      this.processDigit(input, e.key);
    };

    // Handler para backspace
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        this.processBackspace(input);
      }
      // Sempre posiciona cursor no final
      setTimeout(() => {
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }, 0);
    };

    // Handler para input - garante formatação mesmo com paste
    const onInput = (e: Event) => {
      const inputEvent = e as InputEvent;
      if (inputEvent.inputType === 'insertText' || inputEvent.inputType === 'insertCompositionText') {
        return; // Já tratado no keydown
      }
      
      // Para paste e outras operações, limpa e reprocessa apenas dígitos
      const numericValue = input.value.replace(/\D/g, '');
      this.updateValue(input, numericValue);
    };

    // Previne seleção em vários eventos
    input.addEventListener('keydown', onKeyDown);
    input.addEventListener('keyup', onKeyUp);
    input.addEventListener('input', onInput);
    input.addEventListener('focus', preventSelection);
    input.addEventListener('click', preventSelection);
    input.addEventListener('mouseup', preventSelection);

    // Armazena referências para cleanup
    (input as any)._dinheiroMaskListeners = {
      keydown: onKeyDown,
      keyup: onKeyUp,
      input: onInput,
      focus: preventSelection,
      click: preventSelection,
      mouseup: preventSelection
    };
  }

  private processDigit(input: HTMLInputElement, digit: string): void {
    // Remove formatação atual e obtém apenas dígitos
    const currentDigits = input.value.replace(/\D/g, '');
    
    // Adiciona o novo dígito
    const newDigits = currentDigits + digit;
    
    // Atualiza o valor formatado
    this.updateValue(input, newDigits);
  }

  private processBackspace(input: HTMLInputElement): void {
    // Remove formatação atual e obtém apenas dígitos
    const currentDigits = input.value.replace(/\D/g, '');
    
    // Remove o último dígito
    const newDigits = currentDigits.slice(0, -1);
    
    // Se não há dígitos, volta para 0
    this.updateValue(input, newDigits || '0');
  }

  private updateValue(input: HTMLInputElement, digits: string): void {
    // Garante pelo menos 2 dígitos (centavos)
    const paddedDigits = digits.padStart(2, '0');
    
    // Separa centavos dos reais
    const centavos = paddedDigits.slice(-2);
    const reais = paddedDigits.slice(0, -2) || '0';
    
    // Formata os reais com separador de milhares
    const formattedReais = this.formatThousands(reais);
    
    // Monta o valor final
    const formattedValue = `${formattedReais},${centavos}`;
    
    // Atualiza o input
    input.value = formattedValue;
    
    // Dispara evento para integração com Angular Forms
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Posiciona cursor no final
    setTimeout(() => {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }, 0);
  }

  private formatThousands(value: string): string {
    // Remove zeros à esquerda exceto o último
    const trimmed = value.replace(/^0+/, '') || '0';
    
    // Adiciona separador de milhares (ponto)
    return trimmed.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  ngOnDestroy(): void {
    const input = this.el.nativeElement;
    const listeners = (input as any)._dinheiroMaskListeners;
    
    if (listeners) {
      input.removeEventListener('keydown', listeners.keydown);
      input.removeEventListener('keyup', listeners.keyup);
      input.removeEventListener('input', listeners.input);
      input.removeEventListener('focus', listeners.focus);
      input.removeEventListener('click', listeners.click);
      input.removeEventListener('mouseup', listeners.mouseup);
      delete (input as any)._dinheiroMaskListeners;
    }
  }
}
