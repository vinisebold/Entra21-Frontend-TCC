import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-formulario-cliente',
  template: `
    <div class="modal-backdrop" (click)="close.emit()"></div>
    <div class="modal-content">
      <ng-content></ng-content>
      <button (click)="close.emit()">Fechar</button>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: block;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 100%;
    }

    button {
      margin-top: 16px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCliente {
  close = output<void>();
}
