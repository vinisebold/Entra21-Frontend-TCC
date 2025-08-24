import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificacaoToast } from '@shared';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificacaoToast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('entra21-frontend-tcc');
}
