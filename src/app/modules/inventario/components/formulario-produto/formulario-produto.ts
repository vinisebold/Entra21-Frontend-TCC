import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { combineLatest, finalize, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { FornecedorModel } from '../../../cadastros/models/fornecedor.model';
import { ProdutoModel } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { AcabamentoEnum } from '../../enums/acabamento.enum';
import { DinheiroMaskTsDirective } from "../../../../shared/directives/dinheiro-mask";

interface OpcaoAcabamento {
  valor: number;
  imagem: string;
  alt: string;
}

interface ProdutoFormModel {
  tipo: FormControl<string>;
  modelo: FormControl<string>;
  acabamento: FormControl<number>;
  fornecedorId: FormControl<number | null>;
  pecaId: FormControl<string>;
  precoCusto: FormControl<number>;
}

@Component({
  selector: 'app-formulario-produto',
  imports: [ReactiveFormsModule, NgOptimizedImage, DinheiroMaskTsDirective],
  templateUrl: './formulario-produto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioProduto implements OnInit {

  fechar = output<void>();
  salvo = output<ProdutoModel>();


  isLoading = signal(false);
  fornecedores = signal<FornecedorModel[]>([]);
  private fb = inject(FormBuilder).nonNullable;
  private produtoService = inject(ProdutoService);


  tiposPeca = ['Anel', 'Berloque', 'Bracelete', 'Brinco', 'Colar', 'Conjunto', 'Pingente', 'Piercing', 'Pulseira'];

  acabamentos: OpcaoAcabamento[] = [
    { valor: AcabamentoEnum.OURO_PURO, imagem: 'assets/acabamentos/dourado.png', alt: 'Dourado' },
    { valor: AcabamentoEnum.BANHADO_OURO, imagem: 'assets/acabamentos/banho-dourado.png', alt: 'Banho Dourado' },
    { valor: AcabamentoEnum.PRATA_PURA, imagem: 'assets/acabamentos/prata.png', alt: 'Prata' },
    { valor: AcabamentoEnum.BANHADO_PRATA, imagem: 'assets/acabamentos/banho-prata.png', alt: 'Banho Prata' },
    { valor: AcabamentoEnum.ACO, imagem: 'assets/acabamentos/aco.png', alt: 'Aço' },
  ];

  pecaForm: FormGroup<ProdutoFormModel> = this.fb.group({
    tipo: ['Anel', Validators.required],
    modelo: ['', Validators.required],
    acabamento: [AcabamentoEnum.OURO_PURO, Validators.required],
    fornecedorId: [null as number | null, Validators.required],
    pecaId: ['', Validators.required],
    precoCusto: [0, [Validators.required, Validators.min(0.01)]],
  });

  private formChanges = toSignal(
    combineLatest([
      this.pecaForm.controls.tipo.valueChanges.pipe(startWith(this.pecaForm.controls.tipo.value)),
      this.pecaForm.controls.fornecedorId.valueChanges.pipe(startWith(this.pecaForm.controls.fornecedorId.value))
    ])
  );

  idPrefixo = computed(() => {
    const changes = this.formChanges();
    if (!changes) return '-';

    const [tipoSelecionado, fornecedorIdSelecionado] = changes;

    if (!fornecedorIdSelecionado) return '-';

    const fornecedor = this.fornecedores().find(f => f.id === fornecedorIdSelecionado);
    if (!fornecedor) return '-';

    const chaveCodigo = `codigo${tipoSelecionado}` as keyof FornecedorModel;
    return (fornecedor[chaveCodigo] as string) || '-';
  });


  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.isLoading.set(true);
    this.produtoService.getFornecedores()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(fornecedores => {
        this.fornecedores.set(fornecedores);
        if (fornecedores.length > 0) {
          this.pecaForm.controls.fornecedorId.setValue(fornecedores[0].id);
        }
      });
  }

  onFecharClick(): void {
    this.fechar.emit();
  }

  onSubmit(): void {
    this.pecaForm.markAllAsTouched();
    if (this.pecaForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const formValues = this.pecaForm.getRawValue();

    // Converte a string de dinheiro (ex: "35,90") para um número (ex: 35.90)
    const precoCustoString = (formValues.precoCusto as unknown as string) || '0';
    const precoCustoNumerico = parseFloat(precoCustoString.replace(',', '.'));

    const produtoParaSalvar: ProdutoModel = {
      categoria: formValues.tipo,
      nome: formValues.modelo,
      codigoFornecedor: this.idPrefixo() + formValues.pecaId,
      acabamento: formValues.acabamento,
      precoCusto: precoCustoNumerico,
      idFornecedor: formValues.fornecedorId!,
      precoVenda: null,
    };
    
    this.produtoService.addProduto(produtoParaSalvar as any)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Produto salvo com sucesso!', response);
          this.salvo.emit(response as ProdutoModel);
        },
        error: (err) => console.error('Erro ao salvar produto:', err),
      });
  }
}