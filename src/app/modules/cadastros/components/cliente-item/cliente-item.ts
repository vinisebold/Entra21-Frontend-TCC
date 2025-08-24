import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClienteModel } from '@modules/cadastros';


@Component({
  selector: 'app-cliente-item',
  imports: [],
  templateUrl: './cliente-item.html',
  styleUrl: './cliente-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClienteItem {
cliente = input.required<ClienteModel>();
}
