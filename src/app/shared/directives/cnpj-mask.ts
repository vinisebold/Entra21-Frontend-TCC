import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appCnpjMask]',
  host: {
    '(input)': 'aoDigitar($event)',
    '[attr.maxLength]': '18', // 14 dígitos + 3 pontos + 1 barra + 1 hífen
  },
})
export class CnpjMask {
  private elemento = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);

  aoDigitar(evento: Event): void {
    const input = evento.target as HTMLInputElement;

    const valorBruto = input.value;
    const digitos = valorBruto.replace(/\D/g, '').substring(0, 14); // só números, até 14

    const posicaoCursor = input.selectionStart ?? valorBruto.length;
    const digitosAntesDoCursor = valorBruto
      .substring(0, posicaoCursor)
      .replace(/\D/g, '').length;

    const valorFormatado = this.formatarCnpj(digitos);

    this.renderer.setProperty(input, 'value', valorFormatado);

    // Ajusta posição do cursor
    const novaPosicao = this.mapearCursor(digitosAntesDoCursor, valorFormatado);
    input.setSelectionRange(novaPosicao, novaPosicao);
  }

  private formatarCnpj(digitos: string): string {
    if (digitos.length === 0) return '';
    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 5)
      return `${digitos.slice(0, 2)}.${digitos.slice(2)}`;
    if (digitos.length <= 8)
      return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(
        5
      )}`;
    if (digitos.length <= 12)
      return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(
        5,
        8
      )}/${digitos.slice(8)}`;
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(
      5,
      8
    )}/${digitos.slice(8, 12)}-${digitos.slice(12, 14)}`;
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
