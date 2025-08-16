import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appCpfMask]',
  host: {
    '(input)': 'aoDigitar($event)',
    '[attr.maxLength]': '14', // 11 dígitos + 3 pontos + 1 hífen
  },
})
export class CpfMask {
  private elemento = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);

  aoDigitar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    const valorBruto = input.value;
    const digitos = valorBruto.replace(/\D/g, '').substring(0, 11); // só números, até 11

    const posicaoCursor = input.selectionStart ?? valorBruto.length;
    const digitosAntesDoCursor = valorBruto
      .substring(0, posicaoCursor)
      .replace(/\D/g, '').length;

    const valorFormatado = this.formatarCpf(digitos);

    this.renderer.setProperty(input, 'value', valorFormatado);

    // Ajusta a posição do cursor
    const novaPosicao = this.mapearCursor(digitosAntesDoCursor, valorFormatado);
    input.setSelectionRange(novaPosicao, novaPosicao);
  }

  private formatarCpf(digitos: string): string {
    if (digitos.length === 0) return '';
    if (digitos.length <= 3) return digitos;
    if (digitos.length <= 6)
      return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
    if (digitos.length <= 9)
      return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(
        6
      )}`;
    return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(
      6,
      9
    )}-${digitos.slice(9, 11)}`;
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
