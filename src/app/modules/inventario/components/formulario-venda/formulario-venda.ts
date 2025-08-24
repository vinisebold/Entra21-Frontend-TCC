import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

// --- IMPORTS CORRIGIDOS ---
import { FormaPagamento, RegistrarVendaRequest, StatusVenda, VendaResponse } from '../../models/venda.model';
import { VendaService } from '../../services/venda.service';
import { ProdutoModel } from '../../models/produto.model';
import { ClienteModel } from '../../../../modules/cadastros/models/cliente.model';
import { ClienteService } from '../../../../modules/cadastros/services/cliente.service';
import { NotificacaoService } from '../../../../core/services/notificacao.service';
import { DinheiroMaskTsDirective } from '../../../../shared/directives/dinheiro-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-venda',
  standalone: true,
  imports: [ReactiveFormsModule, DinheiroMaskTsDirective, CommonModule],
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
  private clienteService = inject(ClienteService);
  private notificacaoService = inject(NotificacaoService);

  // --- Estado do Componente ---
  isLoading = signal(false);
  clientes = signal<ClienteModel[]>([]);

  // --- Dados para o Template ---
  opcoesSituacao: { label: string; valor: StatusVenda }[] = [
    { label: 'Pendente', valor: 'PENDENTE' },
    { label: 'Pago', valor: 'PAGO' },
  ];

  opcoesPagamento: { label: string; valor: FormaPagamento }[] = [
    { label: 'PIX', valor: 'PIX' },
    { label: 'Dinheiro', valor: 'DINHEIRO' },
    { label: 'Cartão de Crédito', valor: 'CARTAO_CREDITO' },
    { label: 'Cartão de Débito', valor: 'CARTAO_DEBITO' },
  ];

  // --- Formulário Reativo ---
  vendaForm: FormGroup = this.fb.group({
    clienteId: [null, Validators.required],
    situacao: ['PENDENTE', Validators.required],
    formaPagamento: ['PIX', Validators.required],
    precoVenda: [0, [Validators.required, Validators.min(0.01)]],
    parcelas: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.carregarClientes();
    // Preenche o preço de venda com o valor padrão do produto
    if (this.produtoParaVender().precoVenda) {
      this.vendaForm.get('precoVenda')?.setValue(this.produtoParaVender().precoVenda);
    }
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
      this.notificacaoService.mostrarNotificacao('Erro ao carregar clientes.', 'error');
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

    // --- MONTAGEM DO PAYLOAD CORRETO ---
    const payload: RegistrarVendaRequest = {
      produtoId: this.produtoParaVender().id!,
      clienteId: formValues.clienteId,
      precoVenda: formValues.precoVenda,
      formaPagamento: formValues.formaPagamento,
      totalParcelas: formValues.parcelas,
      status: formValues.situacao,
      // dataVencimento pode ser adicionada aqui se o formulário tiver o campo
    };

    try {
      const novaVenda = await firstValueFrom(this.vendaService.registrarVenda(payload));
      this.notificacaoService.mostrarNotificacao('Venda registrada com sucesso!', 'success');
      this.vendaRegistrada.emit(novaVenda);
    } catch (error) {
      this.notificacaoService.mostrarNotificacao('Erro ao registrar venda.', 'error');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFecharClick(): void {
    this.fechar.emit();
  }
}