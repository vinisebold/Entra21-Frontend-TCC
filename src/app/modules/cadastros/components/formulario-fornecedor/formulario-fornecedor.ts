import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FornecedorService, FornecedorModel } from '@modules/cadastros';
import { TelefoneMask, CnpjMask } from '@shared';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-formulario-fornecedor',
  imports: [ReactiveFormsModule, TelefoneMask, CnpjMask],
  templateUrl: './formulario-fornecedor.html',
  styleUrl: './formulario-fornecedor.scss',
})
export class FormularioFornecedor{
  // Adicionado 'implements OnInit' para clareza
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

  isLoading = signal(false);

  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);

  fornecedorForm!: FormGroup;

  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      cnpj: ['', Validators.required],
      telefone: ['', Validators.required],
      codigoAnel: [''],
      codigoBracelete: [''],
      codigoColar: [''],
      codigoBrinco: [''],
      codigoPulseira: [''],
      codigoPingente: [''],
      codigoConjunto: [''],
      codigoBerloque: [''],
      codigoPiercing: [''],
    });
  }

  onFecharClick(): void {
    this.fechar.emit();
  }

  onSalvarClick(): void {
    this.fornecedorForm.markAllAsTouched();

    // Impede o envio se o formulário for inválido ou se já estiver carregando
    if (this.fornecedorForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const novoFornecedor = this.fornecedorForm.value as FornecedorModel;

    this.fornecedorService
      .addFornecedor(novoFornecedor)
      // O bloco finalize garante que isLoading será false ao final da operação (sucesso ou erro)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Fornecedor salvo com sucesso!', response);
          this.salvo.emit();
        },
        error: (err) => {
          console.error('Erro ao salvar fornecedor:', err);
        },
      });
  }
}
