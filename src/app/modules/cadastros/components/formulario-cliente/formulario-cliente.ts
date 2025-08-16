import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-formulario-cliente',
  imports: [ReactiveFormsModule, TelefoneMask, CpfMask],
  templateUrl: './formulario-cliente.html',
  styleUrl: './formulario-cliente.scss',
})
export class FormularioCliente {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvo = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  clienteForm!: FormGroup;

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      cpf: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }

  onFecharClick(): void {
    this.fechar.emit();
  }

  onSalvarClick(): void {
    this.clienteForm.markAllAsTouched();

    if (this.clienteForm.invalid) {
      console.log('Formulário inválido');
      return;
    }

    const novoCliente = this.clienteForm.value as ClienteModel;

    this.clienteService.addCliente(novoCliente).subscribe({
      next: (response) => {
        console.log('Cliente salvo com sucesso!', response);
        this.salvo.emit();
      },
      error: (err) => {
        console.error('Erro ao salvar cliente:', err);
        // Aqui pode add lógica para mostrar um erro ao usuário
      },
    });
  }
}
