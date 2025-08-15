import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FornecedorService } from '../../../../services/fornecedor.service';
import { FornecedorModel } from '../../../../models/fornecedor.model';

@Component({
  selector: 'app-formulario-fornecedor',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-fornecedor.html',
  styleUrl: './formulario-fornecedor.scss',
})
export class FormularioFornecedor {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();

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

    if (this.fornecedorForm.invalid) {
      console.log('Formulário inválido');
      return;
    }

    const novoFornecedor = this.fornecedorForm.value as FornecedorModel;

    this.fornecedorService.addFornecedor(novoFornecedor).subscribe({
      next: (response) => {
        console.log('Fornecedor salvo com sucesso!', response);
        this.salvo.emit(); // 5. Avisa o componente pai que salvou com sucesso!
      },
      error: (err) => {
        console.error('Erro ao salvar fornecedor:', err);
        // Aqui você pode adicionar uma lógica para mostrar um erro ao usuário
      },
    });
  }
}
