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
import { ClienteService } from '../../../cadastros/services/cliente.service';
import { ClienteModel } from '../../../cadastros/models/cliente.model';
import { ProdutoModel } from '../../models/produto.model';
import { RegistrarVendaPayload, VendaRecibo } from '../../models/venda.model';
import { VendaService } from '../../services/venda.service';

@Component({
  selector: 'app-formulario-venda',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-venda.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioVenda implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly vendaService = inject(VendaService);

  readonly opcoesSituacao = [
    { id: 2, nome: 'Pago' },
    { id: 1, nome: 'Pendente' },
  ];

  readonly opcoesPagamento = [
    { id: 1, nome: 'Pix', icon: 'icon-pix' }, // O 'icon' é um exemplo, ajuste para o seu sistema de ícones
    { id: 2, nome: 'Dinheiro', icon: 'icon-money' },
    { id: 3, nome: 'Crédito', icon: 'icon-credit-card' },
    { id: 4, nome: 'Débito', icon: 'icon-debit-card' },
  ];

  // Outputs
  // Usa a função output() para emitir um evento quando o modal deve ser fechado
  fechar = output<void>();
  vendaRegistrada = output<VendaRecibo>();

  // Estado com signals
  readonly isLoading = signal(false);
  private readonly clientes = signal<ClienteModel[]>([]);
  readonly erroApi = signal<string | null>(null);

  // Formulário reativo
  vendaForm!: FormGroup;

  // Derived states
  readonly listaClientes = computed(() => this.clientes());
  readonly isCredito = computed(
    () => this.vendaForm?.get('formaPagamento')?.value === 3
  );

  // Recebe o obj produto do componente pai
  produto = input.required<ProdutoModel>();

  ngOnInit(): void {
    console.log('ID DO PRODUTO:', this.produto().id);

    this.inicializarFormulario();
    this.carregarClientes();
  }

  private inicializarFormulario(): void {
    this.vendaForm = this.fb.group({
      clienteId: [null, Validators.required],
      situacao: [1, Validators.required],
      formaPagamento: [2, Validators.required],
      precoVenda: [this.produto()?.precoVenda ?? null, Validators.required],
      parcelas: [0],
    });
  }

  // buscar os clientes da API
  private carregarClientes(): void {
    this.isLoading.set(true);
    this.clienteService.getClientes().subscribe({
      next: (clientesDaApi) => {
        this.clientes.set(clientesDaApi);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar clientes:', err);
        this.isLoading.set(false);
      },
    });
  }
  onSubmit(): void {
    if (this.vendaForm.invalid) {
      this.vendaForm.markAllAsTouched();
      return;
    }
  
    this.isLoading.set(true);
    this.erroApi.set(null);
  
    const formValue = this.vendaForm.value;

    const payload: RegistrarVendaPayload = {
      clienteId: Number(formValue.clienteId), // A API espera um número
      situacao: Number(formValue.situacao),
      formaPagamento: Number(formValue.formaPagamento),
      numeroParcelas: Number(formValue.parcelas),
    };
  
    const produtoId = this.produto().id!;
    console.log(`7. ID do produto: ${produtoId}. CHAMANDO O SERVIÇO AGORA...`);

    // Chamar o serviço com os parâmetros corretos
    this.vendaService.registrarVenda(produtoId, payload).subscribe({
      next: (reciboDaVenda) => {
        console.log('Venda registrada com sucesso!', reciboDaVenda);
        this.vendaRegistrada.emit(reciboDaVenda);
        this.fechar.emit();
      },
      error: (err) => {
        console.error('Erro ao registrar venda:', err);
        this.erroApi.set(
          'Falha ao registrar a venda. Verifique os dados e tente novamente.'
        );
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  onFecharClick(): void {
    this.fechar.emit();
  }
}
