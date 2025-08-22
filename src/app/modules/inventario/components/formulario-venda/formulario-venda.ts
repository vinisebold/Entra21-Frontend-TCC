import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    this.isLoading.set(true); this.clienteService.getClientes().subscribe({
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
    console.log('1. Método onSubmit() foi chamado.');
    if (this.vendaForm.invalid) {
      this.vendaForm.markAllAsTouched();
      console.error('❌ ERRO: O formulário é inválido. A execução foi interrompida.');
      return;
    }

    console.log('3. O formulário é válido. Configurando loading...');

    this.isLoading.set(true);
    this.erroApi.set(null);

    const formValue = this.vendaForm.value;
    

    console.log('4. Valores do formulário:', formValue);

    // Buscar o nome do cliente a partir do ID selecionado
    const clienteIdNumerico = Number(formValue.clienteId); 
    const clienteSelecionado = this.clientes().find(c => c.id === clienteIdNumerico);
    if (!clienteSelecionado) {
      console.error('❌ ERRO: Cliente não foi encontrado na lista. A execução foi interrompida.');
      this.erroApi.set('Cliente selecionado não encontrado. Por favor, recarregue a página.');
      this.isLoading.set(false);
      return;
    }

    console.log('5. Cliente encontrado:', clienteSelecionado);

    // Monta o payload que a API espera
    const payload: RegistrarVendaPayload = {
      nomeCliente: clienteSelecionado.nome,
      situacao: Number(formValue.situacao),
      formaPagamento: Number(formValue.formaPagamento),
      numeroParcelas: Number(formValue.parcelas),
    };

    console.log('6. Payload montado para a API:', payload);

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
        this.erroApi.set('Falha ao registrar a venda. Verifique os dados e tente novamente.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  onFecharClick(): void {
    this.fechar.emit();
  }
}
