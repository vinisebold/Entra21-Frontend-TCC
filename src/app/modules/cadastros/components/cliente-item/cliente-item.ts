import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ClienteModel } from '@modules/cadastros';


@Component({
  selector: 'app-cliente-item',
  imports: [DatePipe],
  templateUrl: './cliente-item.html',
  styleUrl: './cliente-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClienteItem {
cliente = input.required<ClienteModel>();
}
