import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import {
  RegistrarVendaRequest,
  VendaResponse,
  VendaService,
  ProdutoService,
} from '@modules/inventario';
import { ClienteModel, ClienteService } from '@modules/cadastros';
import { NotificacaoService } from '@core';

@Component({
  selector: 'app-registrar-venda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-venda.html',
  styleUrl: './registrar-venda.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrarVenda implements OnInit {
  fechar = output<void>();
  vendaRegistrada = output<VendaResponse>();

  private fb = inject(FormBuilder);
  private vendaService = inject(VendaService);
  private clienteService = inject(ClienteService);
  private produtoService = inject(ProdutoService);
  private notificacao = inject(NotificacaoService);

  isLoading = signal(false);
  clientes = signal<ClienteModel[]>([]);
  produtoNome = signal<string>('');

  opcoesSituacao = [
    { nome: 'Pendente', id: 'PENDENTE' },
    { nome: 'Pago', id: 'PAGO' },
  ];
  opcoesPagamento = [
    { nome: 'PIX', id: 'PIX', icon: 'pix' },
    { nome: 'Dinheiro', id: 'DINHEIRO', icon: 'money' },
    { nome: 'Cartão de Crédito', id: 'CARTAO_CREDITO', icon: 'credit-card' },
    { nome: 'Cartão de Débito', id: 'CARTAO_DEBITO', icon: 'credit-card' },
  ];

  vendaForm: FormGroup = this.fb.group({
    produtoId: [null, [Validators.required, Validators.min(1)]],
    clienteId: [null, Validators.required],
    situacao: ['PENDENTE', Validators.required],
    formaPagamento: ['PIX', Validators.required],
    precoVenda: [0, [Validators.required, Validators.min(0.01)]],
    parcelas: [1, [Validators.required, Validators.min(1)]],
    dataVencimento: [null],
  });

  ngOnInit(): void {
    this.carregarClientes();
  }

  async carregarClientes(): Promise<void> {
    this.isLoading.set(true);
    try {
      const resposta = await firstValueFrom(this.clienteService.getClientes());
      this.clientes.set(resposta.content);
      if (resposta.content.length > 0) {
        this.vendaForm.get('clienteId')?.setValue(resposta.content[0].id);
      }
    } catch (e) {
      this.notificacao.mostrarNotificacao('Erro ao carregar clientes.', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  async buscarProduto(): Promise<void> {
    const id = this.vendaForm.get('produtoId')?.value;
    if (!id) return;
    try {
      const produto = await firstValueFrom(this.produtoService.getById(Number(id)));
      this.produtoNome.set(produto.nome);
      if (produto.precoVenda) {
        this.vendaForm.get('precoVenda')?.setValue(produto.precoVenda);
      }
    } catch (e) {
      this.produtoNome.set('');
      this.notificacao.mostrarNotificacao('Produto não encontrado.', 'error');
    }
  }

  async onSubmit(): Promise<void> {
    this.vendaForm.markAllAsTouched();
    if (this.vendaForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    const f = this.vendaForm.getRawValue();
    const parseMoney = (val: unknown): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const digits = val.replace(/[^\d]/g, '');
        if (!digits) return 0;
        return Number(digits) / 100;
      }
      return 0;
    };
    const payload: RegistrarVendaRequest = {
      produtoId: Number(f.produtoId),
      clienteId: Number(f.clienteId),
      precoVenda: parseMoney(f.precoVenda),
      formaPagamento: f.formaPagamento,
      totalParcelas: Number(f.parcelas),
      status: f.situacao,
      dataVencimento: f.dataVencimento || undefined,
    };
    try {
      const venda = await firstValueFrom(this.vendaService.registrarVenda(payload));
      this.notificacao.mostrarNotificacao('Venda registrada com sucesso!', 'success');
      this.vendaRegistrada.emit(venda);
    } catch (e) {
      this.notificacao.mostrarNotificacao('Erro ao registrar venda.', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  onFecharClick(): void {
    this.fechar.emit();
  }
}
