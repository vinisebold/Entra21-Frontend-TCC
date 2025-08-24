import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { FornecedorModel } from '@modules/cadastros';
import { AcabamentoProduto, ProdutoModel } from '@modules/inventario';
import { ProdutoService } from '@modules/inventario';
import { FornecedorService } from '@modules/cadastros';
import { NotificacaoService } from '@core';
import { DinheiroMaskTsDirective } from "../../../../shared/directives/dinheiro-mask";

// Interface para as opções de acabamento no template
interface OpcaoAcabamento {
  valor: AcabamentoProduto;
  imagem: string;
  alt: string;
}

@Component({
  selector: 'app-formulario-produto',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage, DinheiroMaskTsDirective],
  templateUrl: './formulario-produto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioProduto implements OnInit {
  // --- Entradas e Saídas do Componente ---
  produto = input<ProdutoModel | null>(null);
  fechar = output<void>();
  salvo = output<void>();

  // --- Injeção de Dependências ---
  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private fornecedorService = inject(FornecedorService);
  private notificacaoService = inject(NotificacaoService);

  // --- Estado do Componente (Signals) ---
  isLoading = signal(false);
  fornecedores = signal<FornecedorModel[]>([]);
  isEditMode = computed(() => !!this.produto());

  // --- Dados para o Template ---
  tiposPeca = ['Anel', 'Berloque', 'Bracelete', 'Brinco', 'Colar', 'Conjunto', 'Pingente', 'Piercing', 'Pulseira'];
  acabamentos: OpcaoAcabamento[] = [
    { valor: 'DOURADO', imagem: 'assets/acabamentos/dourado.png', alt: 'Dourado' },
    { valor: 'BANHO_DOURADO', imagem: 'assets/acabamentos/banho-dourado.png', alt: 'Banho Dourado' },
    { valor: 'PRATA', imagem: 'assets/acabamentos/prata.png', alt: 'Prata' },
    { valor: 'BANHO_PRATA', imagem: 'assets/acabamentos/banho-prata.png', alt: 'Banho Prata' },
    { valor: 'ACO', imagem: 'assets/acabamentos/aco.png', alt: 'Aço' },
  ];

  // --- Formulário Reativo ---
  pecaForm: FormGroup = this.fb.group({
    id: [null],
    nome: ['', Validators.required],
    categoria: ['Anel', Validators.required],
    idReferencia: ['', Validators.required], // Apenas a parte numérica
    precoCusto: [0, [Validators.required, Validators.min(0.01)]],
    precoVenda: [null as number | null, [Validators.min(0)]],
    idFornecedor: [null as number | null, Validators.required],
    acabamento: ['DOURADO' as AcabamentoProduto, Validators.required],
  });

  // --- Lógica de Prefixo Reativa ---
  private categoriaSel = toSignal(this.pecaForm.get('categoria')!.valueChanges, {
    initialValue: this.pecaForm.get('categoria')!.value,
  });
  private fornecedorSel = toSignal(this.pecaForm.get('idFornecedor')!.valueChanges, {
    initialValue: this.pecaForm.get('idFornecedor')!.value,
  });

  idPrefixo = computed(() => {
    const fornecedorId = this.fornecedorSel();
    const categoria = this.categoriaSel();
    if (!fornecedorId || !categoria) return '-';

    const fornecedor = this.fornecedores().find((f) => f.id === fornecedorId);
    if (!fornecedor) return '-';

    return this.getPrefixoPorCategoria(fornecedor, categoria) || '-';
  });

  constructor() {
    // Efeito para preencher o formulário quando estiver em modo de edição
    effect(() => {
      const produtoParaEditar = this.produto();
      if (produtoParaEditar) {
        this.pecaForm.patchValue(this.separarPrefixoDoId(produtoParaEditar));
      } else {
        this.pecaForm.reset({ categoria: 'Anel', acabamento: 'DOURADO', precoCusto: 0 });
      }
    });
  }

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  async carregarFornecedores(): Promise<void> {
    this.isLoading.set(true);
    try {
      const resposta = await firstValueFrom(this.fornecedorService.getFornecedores());
      this.fornecedores.set(resposta.content);
      // Se não estiver editando e houver fornecedores, seleciona o primeiro
      if (!this.isEditMode() && resposta.content.length > 0) {
        this.pecaForm.get('idFornecedor')?.setValue(resposta.content[0].id);
      }
    } catch (error) {
      this.notificacaoService.mostrarNotificacao('Erro ao carregar fornecedores.', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    this.pecaForm.markAllAsTouched();
    if (this.pecaForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const formValues = this.pecaForm.getRawValue();

    const normalizarMoeda = (valor: unknown): number => {
      if (typeof valor === 'number') return valor;
      if (typeof valor === 'string') {
        const limpo = valor.replace(/\./g, '').replace(',', '.').replace(/[^0-9.\-]/g, '');
        const num = Number(limpo);
        return isNaN(num) ? 0 : num;
      }
      return 0;
    };

    const idRefSomenteDigitos = String(formValues.idReferencia ?? '')
      .replace(/\D/g, '')
      .trim();

    // O backend espera apenas a parte numérica, ele irá juntar com o prefixo.
    const produtoParaSalvar: ProdutoModel = {
      id: formValues.id,
      nome: formValues.nome,
      categoria: formValues.categoria,
      idReferencia: idRefSomenteDigitos, // Envia só o número
      precoCusto: normalizarMoeda(formValues.precoCusto),
      precoVenda:
        formValues.precoVenda === null || formValues.precoVenda === ''
          ? null
          : normalizarMoeda(formValues.precoVenda),
      idFornecedor: Number(formValues.idFornecedor),
      acabamento: formValues.acabamento,
    };

    try {
      if (this.isEditMode()) {
        await firstValueFrom(this.produtoService.updateProduto(produtoParaSalvar.id!, produtoParaSalvar));
        this.notificacaoService.mostrarNotificacao('Produto atualizado com sucesso!', 'success');
      } else {
        await firstValueFrom(this.produtoService.addProduto(produtoParaSalvar));
        this.notificacaoService.mostrarNotificacao('Produto adicionado com sucesso!', 'success');
      }
      this.salvo.emit();
    } catch (error) {
      this.notificacaoService.mostrarNotificacao('Erro ao salvar produto.', 'error');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFecharClick(): void {
    this.fechar.emit();
  }

  private separarPrefixoDoId(produto: ProdutoModel) {
    const fornecedor = this.fornecedores().find(f => f.id === produto.idFornecedor);
    let idSemPrefixo = produto.idReferencia;

    if (fornecedor) {
      const prefixo = this.getPrefixoPorCategoria(fornecedor, produto.categoria);
      if (prefixo && produto.idReferencia.startsWith(prefixo)) {
        idSemPrefixo = produto.idReferencia.substring(prefixo.length);
      }
    }
    return { ...produto, idReferencia: idSemPrefixo };
  }

  private getPrefixoPorCategoria(fornecedor: FornecedorModel, categoria: string): string | undefined {
    const chave = `codigo${categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()}` as keyof FornecedorModel;
    return fornecedor[chave] as string | undefined;
  }
}