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
import { TelefoneMask, CpfCnpjMask } from '@shared';
import { finalize } from 'rxjs';
import { Botao } from '../../../../shared/components/botao/botao';

@Component({
  selector: 'app-formulario-cliente',
  imports: [ReactiveFormsModule, TelefoneMask, CpfCnpjMask, Botao],
  templateUrl: './formulario-cliente.html',
  styleUrl: './formulario-cliente.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCliente {
  readonly fechar = output<void>();
  readonly salvo = output<void>();

  readonly isLoading = signal(false);
  readonly mostrarMaisInfo = signal(false);

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  readonly clienteForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
  descricao: [''],
  telefone: ['', Validators.required],
  email: ['', Validators.email],
  cpf: [''],
  });

  onFecharClick(): void {
    this.fechar.emit();
  }

  toggleMaisInfo(): void {
    this.mostrarMaisInfo.update((v) => !v);
  }

  onSalvarClick(): void {
    this.clienteForm.markAllAsTouched();

    if (this.clienteForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    // Envia apenas campos suportados no backend atual
    const { nome, descricao, telefone, cpf } = this.clienteForm.value as {
      nome: string;
      descricao?: string | null;
      telefone: string;
      cpf?: string | null;
    };
    const novoCliente = { nome, descricao: descricao ?? '', telefone, cpf: cpf ?? '' } as ClienteModel;

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
