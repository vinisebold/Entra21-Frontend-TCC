import { Injectable, signal } from '@angular/core';
export type TipoNotificacao = 'success' | 'error';

export interface Notificacao {
  mensagem: string;
  tipo: TipoNotificacao;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {

  readonly notificacao = signal<Notificacao | null>(null);

  private timerId?: number;

  mostrarNotificacao(mensagem: string, tipo: TipoNotificacao): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    // Define a nova notificação, que será exibida pelo componente Toast.
    this.notificacao.set({ mensagem, tipo });

    // Agenda o desaparecimento automático da notificação após 5 segundos.
    this.timerId = window.setTimeout(() => {
      this.notificacao.set(null);
    }, 5000);
  }
}
