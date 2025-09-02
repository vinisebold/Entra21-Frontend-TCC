import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';

// --- IMPORTS CORRIGIDOS ---
import {
  FormaPagamento,
  RegistrarVendaRequest,
  StatusVenda,
  VendaResponse,
  VendaService,
  ProdutoModel,
} from '@modules/inventario';
import { ProdutoService } from '@modules/inventario';
import { ClienteModel, ClienteService } from '@modules/cadastros';
import { NotificacaoService } from '@core';
import { DinheiroMaskTsDirective } from '@shared';
import { CommonModule } from '@angular/common';
import { Botao } from '../../../../shared/components/botao/botao';

@Component({
  selector: 'app-formulario-venda',
  standalone: true,
  imports: [ReactiveFormsModule, DinheiroMaskTsDirective, CommonModule, Botao],
  templateUrl: './formulario-venda.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioVenda implements OnInit {
  // --- Entradas e Saídas ---
  produtoParaVender = input.required<ProdutoModel>();
  fechar = output<void>();
  vendaRegistrada = output<VendaResponse>();

  // --- Injeção de Dependências ---
  private fb = inject(FormBuilder);
  private vendaService = inject(VendaService);
  private produtoService = inject(ProdutoService);
  private clienteService = inject(ClienteService);
  private notificacaoService = inject(NotificacaoService);

  // --- Estado do Componente ---
  isLoading = signal(false);
  clientes = signal<ClienteModel[]>([]);

  // --- Dados para o Template ---
  opcoesSituacao = [
    { nome: 'Pendente', id: 'PENDENTE' },
    { nome: 'Pago', id: 'PAGO' },
  ];

  opcoesPagamento = [
  { nome: 'PIX', id: 'PIX', icon: 'icon-pix' },
  { nome: 'Dinheiro', id: 'DINHEIRO', icon: 'icon-dinheiro' },
  { nome: 'Cartão de Crédito', id: 'CARTAO_CREDITO', icon: 'icon-card' },
  { nome: 'Cartão de Débito', id: 'CARTAO_DEBITO', icon: 'icon-card' },
  ];

  isCredito = computed(
    () => this.vendaForm.get('formaPagamento')?.value === 'CARTAO_CREDITO'
  );

  // --- Formulário Reativo ---
  vendaForm: FormGroup = this.fb.group({
    clienteId: [null, Validators.required],
    situacao: ['PENDENTE', Validators.required],
    formaPagamento: ['PIX', Validators.required],
    precoVenda: [0, [Validators.required, Validators.min(0.01)]],
  parcelas: [1, [Validators.required, Validators.min(1)]],
  dataVencimento: [null],
  });

  // Data mínima de vencimento (hoje)
  readonly todayStr = this.formatDate(new Date());

  ngOnInit(): void {
    this.carregarClientes();
    if (this.produtoParaVender().precoVenda) {
      this.vendaForm
        .get('precoVenda')
        ?.setValue(this.produtoParaVender().precoVenda);
    }

    // Regras: dataVencimento obrigatória somente quando status = PENDENTE
    this.vendaForm.get('situacao')?.valueChanges.subscribe((status) => {
      const ctrl = this.vendaForm.get('dataVencimento');
      if (!ctrl) return;
      if (status === 'PENDENTE') {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue(null);
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  async carregarClientes(): Promise<void> {
    this.isLoading.set(true);
    try {
      const resposta = await firstValueFrom(this.clienteService.getClientes());
      this.clientes.set(resposta.content);
      // Seleciona o primeiro cliente se a lista não estiver vazia
      if (resposta.content.length > 0) {
        this.vendaForm.get('clienteId')?.setValue(resposta.content[0].id);
      }
    } catch (error) {
      this.notificacaoService.mostrarNotificacao(
        'Erro ao carregar clientes.',
        'error'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    this.vendaForm.markAllAsTouched();
    if (this.vendaForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    const formValues = this.vendaForm.getRawValue();

    // Pré-checagem opcional: garantir que o produto ainda está EM_ESTOQUE
    try {
      const produto = await firstValueFrom(
        this.produtoService.getById(this.produtoParaVender().id!)
      );
      if (produto.status && produto.status !== 'EM_ESTOQUE') {
        this.notificacaoService.mostrarNotificacao(
          'Produto indisponível para venda (não está em estoque).',
          'error'
        );
        this.isLoading.set(false);
        return;
      }
    } catch (e: any) {
      const msg =
        e?.error?.message ||
        e?.error?.error ||
        'Não foi possível validar a disponibilidade do produto.';
      this.notificacaoService.mostrarNotificacao(msg, 'error');
      this.isLoading.set(false);
      return;
    }


    const parseMoney = (val: unknown): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const sanitized = val
          .toString()
          .trim()
          .replace(/[^\d.,-]/g, '')
          .replace(/\./g, '')
          .replace(/,/g, '.');
        const n = Number(sanitized);
        return isNaN(n) ? 0 : n;
      }
      return 0;
    };

    // --- MONTAGEM DO PAYLOAD ---
    const payload: RegistrarVendaRequest = {
      produtoId: this.produtoParaVender().id!,
      clienteId: formValues.clienteId,
      precoVenda: parseMoney(formValues.precoVenda),
      formaPagamento: formValues.formaPagamento,
      totalParcelas: Number(formValues.parcelas),
      status: formValues.situacao,
      dataVencimento:
        formValues.situacao === 'PENDENTE' && formValues.dataVencimento
          ? formValues.dataVencimento
          : undefined,
    };

    try {
      const novaVenda = await firstValueFrom(
        this.vendaService.registrarVenda(payload)
      );
      this.notificacaoService.mostrarNotificacao(
        'Venda registrada com sucesso!',
        'success'
      );
      this.vendaRegistrada.emit(novaVenda);
    } catch (error: any) {
      const mensagem =
        error?.error?.message || error?.error?.error || error?.message || 'Erro ao registrar venda.';
      this.notificacaoService.mostrarNotificacao(mensagem, 'error');
      console.error('Registrar venda falhou:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFecharClick(): void {
    this.fechar.emit();
  }

  private formatDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
