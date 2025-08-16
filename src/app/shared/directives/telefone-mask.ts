import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appTelefoneMask]',
  host: {
    '(input)': 'aoDigitar($event)',
    '[attr.maxLength]': '15',
  },
})
export class TelefoneMask {
  private elemento = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);

  aoDigitar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    const valorBruto = input.value;
    const digitos = valorBruto.replace(/\D/g, '').substring(0, 11);

    const posicaoCursor = input.selectionStart ?? valorBruto.length;
    const digitosAntesDoCursor = valorBruto
      .substring(0, posicaoCursor)
      .replace(/\D/g, '').length;

    const valorFormatado = this.formatarTelefone(digitos);

    this.renderer.setProperty(input, 'value', valorFormatado);

    // Mantém o cursor na posição proporcional
    let novaPosicao = this.mapearCursor(digitosAntesDoCursor, valorFormatado);
    input.setSelectionRange(novaPosicao, novaPosicao);
  }

  private formatarTelefone(digitos: string): string {
    if (digitos.length === 0) return ''; // evita deixar "(" sozinho
    if (digitos.length <= 2) return `(${digitos}`;
    if (digitos.length <= 7)
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(
      7
    )}`;
  }

  private mapearCursor(qtdDigitos: number, valorFormatado: string): number {
    let contador = 0;
    for (let i = 0; i < valorFormatado.length; i++) {
      if (/\d/.test(valorFormatado[i])) contador++;
      if (contador === qtdDigitos) return i + 1;
    }
    return valorFormatado.length;
  }
}
