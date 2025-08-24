import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService, ClienteModel } from '@modules/cadastros';
import { TelefoneMask } from '../../../../shared/directives/telefone-mask';
import { CpfMask } from '../../../../shared/directives/cpf-mask';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-formulario-cliente',
  imports: [ReactiveFormsModule, TelefoneMask, CpfMask],
  templateUrl: './formulario-cliente.html',
  styleUrl: './formulario-cliente.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCliente {
  readonly fechar = output<void>();
  readonly salvo = output<void>();

  readonly isLoading = signal(false);

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  readonly clienteForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    descricao: [''],
    cpf: ['', Validators.required],
    telefone: ['', Validators.required],
  });

  onFecharClick(): void {
    this.fechar.emit();
  }

  onSalvarClick(): void {
    this.clienteForm.markAllAsTouched();

    if (this.clienteForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const novoCliente = this.clienteForm.value as ClienteModel;

    this.clienteService
      .addCliente(novoCliente)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Cliente salvo com sucesso!', response);
          this.clienteForm.reset();
          this.salvo.emit();
        },
        error: (err) => {
          console.error('Erro ao salvar cliente:', err);
        },
      });
  }
}
