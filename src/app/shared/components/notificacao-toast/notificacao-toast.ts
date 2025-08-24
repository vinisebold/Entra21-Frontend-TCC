import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificacaoService } from '@core';

@Component({
  selector: 'app-notificacao-toast',
  standalone: true,
  template: `
    @if (notificacao(); as notificacao) {
    <div
      class="toast"
      [class.success]="notificacao.tipo === 'success'"
      [class.error]="notificacao.tipo === 'error'"
      role="status"
      aria-live="polite"
    >
      <p>{{ notificacao.mensagem }}</p>
    </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      bottom: 20px;
  left: 20px;
      z-index: 1000;
    }

    .toast {
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: fadeInOut 5s forwards;
    }

  .toast.success { background-color: #9fa86d; }
  .toast.error { background-color: #e57373; }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(20px); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificacaoToast {
  private notificacaoService = inject(NotificacaoService);

  // Lê o signal diretamente do serviço injetado.
  notificacao = this.notificacaoService.notificacao;
}
