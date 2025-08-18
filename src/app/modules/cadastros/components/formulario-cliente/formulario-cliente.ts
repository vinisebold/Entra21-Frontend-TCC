import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ClienteModel } from '../../models/cliente.model';
import { TelefoneMask } from '../../../../shared/directives/telefone-mask';
import { CpfMask } from '../../../../shared/directives/cpf-mask';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-formulario-cliente',
  imports: [ReactiveFormsModule, TelefoneMask, CpfMask],
  templateUrl: './formulario-cliente.html',
  styleUrl: './formulario-cliente.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormularioCliente {
  fechar = output<void>();
  salvo = output<void>();
  
isLoading = signal(false);

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  clienteForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    descricao: [''],
    cpf: ['', Validators.required],
    telefone: ['', Validators.required],
  });

  ngOnInit(): void {
  }

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
          this.salvo.emit();
        },
        error: (err) => {
          console.error('Erro ao salvar cliente:', err);
        },
      });
  }
}
