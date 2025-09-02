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
import { Botao } from '../../../../shared/components/botao/botao';

@Component({
  selector: 'app-formulario-fornecedor',
  imports: [ReactiveFormsModule, TelefoneMask, CnpjMask, Botao],
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

  // Prefixos fixos e estáticos que devem ser enviados ao backend
  readonly prefixos = [
    { label: 'Anel', key: 'codigoAnel', code: 'an' },
    { label: 'Pulseira', key: 'codigoPulseira', code: 'pl' },
    { label: 'Brinco', key: 'codigoBrinco', code: 'br' },
    { label: 'Bracelete', key: 'codigoBracelete', code: 'bc' },
    { label: 'Pingente', key: 'codigoPingente', code: 'pg' },
    { label: 'Berloque', key: 'codigoBerloque', code: 'bq' },
    { label: 'Colar', key: 'codigoColar', code: 'cl' },
    { label: 'Conjunto', key: 'codigoConjunto', code: 'cj' },
    { label: 'Piercing', key: 'codigoPiercing', code: 'pirc' },
  ] as const;

  // Divisão em 2 colunas para visualização
  readonly prefixosColA = this.prefixos.slice(0, Math.ceil(this.prefixos.length / 2));
  readonly prefixosColB = this.prefixos.slice(Math.ceil(this.prefixos.length / 2));

  private readonly fixedCodigos: Partial<FornecedorModel> = this.prefixos
    .reduce((acc, item) => ({ ...acc, [item.key]: item.code }), {} as Partial<FornecedorModel>);

  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      cnpj: ['', Validators.required],
  telefone: ['', Validators.required],
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

    // Mescla os dados do formulário com os prefixos fixos
    const novoFornecedor = {
      ...this.fornecedorForm.getRawValue(),
      ...this.fixedCodigos,
    } as FornecedorModel;

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
