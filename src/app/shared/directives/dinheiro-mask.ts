import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appDinheiroMask]',
  host: {
    '(input)': 'aoDigitar($event)',
  },
})
export class DinheiroMaskTsDirective {

  private el = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);

  /**
   * Método chamado a cada vez que o usuário digita no input.
   */
  aoDigitar(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const valorBruto = input.value;

    // 1. Limpa o valor, mantendo apenas os dígitos numéricos.
    const digitos = valorBruto.replace(/\D/g, '');

    // 2. Guarda a posição do cursor e quantos dígitos havia antes dele.
    const posicaoCursor = input.selectionStart ?? 0;
    const digitosAntesDoCursor = valorBruto
      .substring(0, posicaoCursor)
      .replace(/\D/g, '').length;

    // 3. Formata os dígitos para o padrão monetário (ex: "1.234,56").
    const valorFormatado = this.formatarDinheiro(digitos);

    // 4. Atualiza o valor do input na tela.
    this.renderer.setProperty(input, 'value', valorFormatado);

    // 5. Recalcula e ajusta a posição do cursor para uma digitação fluida.
    const novaPosicao = this.mapearCursor(digitosAntesDoCursor, valorFormatado);
    input.setSelectionRange(novaPosicao, novaPosicao);
  }

  /**
   * Formata uma string de dígitos para o padrão de moeda brasileiro.
   * Ex: "123456" -> "1.234,56"
   */
  private formatarDinheiro(digitos: string): string {
    if (!digitos) {
      return '';
    }

    // Converte a string de dígitos para um número (ex: "12345" -> 123.45)
    const valorNumerico = parseInt(digitos, 10) / 100;

    // Usa a API de internacionalização do navegador para formatar o número
    // de forma correta e eficiente para o padrão pt-BR.
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  }

  /**
   * Mapeia a posição do cursor do valor antigo para o valor formatado.
   */
  private mapearCursor(qtdDigitos: number, valorFormatado: string): number {
    if (qtdDigitos === 0) {
      return 0;
    }

    let contador = 0;
    for (let i = 0; i < valorFormatado.length; i++) {
      if (/\d/.test(valorFormatado[i])) {
        contador++;
      }
      if (contador === qtdDigitos) {
        return i + 1;
      }
    }
    return valorFormatado.length;
  }
}
