# Gerenciamento de Estado Reativo com Angular Signals

## Problema Anterior

### Padrão Imperativo (Antes)
```typescript
export class ListaClientes implements OnInit {
  clientes = signal<ClienteModel[]>([]);
  
  ngOnInit(): void {
    this.carregarClientes(); // ❌ Imperativo
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe((dados) => {
      this.clientes.set(dados.content); // ❌ Gerenciamento manual de estado
    });
  }

  deletarCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe(() => {
      // ❌ Atualização manual do estado local
      this.clientes.update((lista) => lista.filter(c => c.id !== id));
    });
  }
}
```

**Problemas:**
- **Imperativo**: "Faça isso, depois faça aquilo"
- **Duplicação de estado**: Estado no componente + estado no servidor
- **Sincronização manual**: Cada operação requer atualização manual
- **ngOnInit necessário**: Para disparar carregamento inicial
- **Múltiplos subscribes**: Gerenciamento manual de subscrições

## Solução Reativa (Depois)

### 1. Serviço com Estado Reativo (simples e em português)

```typescript
@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);

  // Estado simples e direto
  readonly clientes = signal<ClienteModel[]>([]);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  listar(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.http.get<RespostaPaginada<ClienteModel>>(this.apiUrl)
      .pipe(catchError(() => { this.erro.set('Erro ao carregar clientes'); return of(null); }))
      .subscribe((res) => {
        if (res) this.clientes.set(res.content);
        this.carregando.set(false);
      });
  }

  addCliente(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.apiUrl, cliente).pipe(
      map((novo) => { this.clientes.update((l) => [...l, novo]); return novo; })
    );
  }
}
```

### 2. Componente Declarativo

```typescript
export class ListaClientes {
  private clienteService = inject(ClienteService);
  
  // 🔥 Acesso direto aos signals do serviço
  readonly clientes = this.clienteService.clientes;
  readonly carregando = this.clienteService.carregando;
  readonly erro = this.clienteService.erro;
  
  // 🔥 Estado local apenas para UI
  readonly mostrarModalCliente = signal(false);
  
  // 🔥 Computed derivado para mensagens
  readonly mensagemLista = computed(() => {
  if (this.carregando()) return 'Carregando...';
  if (this.erro()) return this.erro();
    if (this.clientes().length === 0) return 'Nenhum cliente encontrado';
    return `${this.clientes().length} cliente(s) encontrado(s)`;
  });

  constructor() {
  // ✅ Carregamento automático, sem ngOnInit
  this.clienteService.listar();
  }

  // 🔥 Operações simples - estado atualizado automaticamente
  deletarCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => console.log('Cliente deletado'),
      error: (error) => console.error('Erro:', error)
    });
    // ✅ Não precisa atualizar estado manualmente!
  }

  onClienteSalvo(): void {
    this.closeClienteModal();
    // ✅ Não precisa recarregar - estado atualizado automaticamente!
  }
}
```

### 3. Template Reativo

```html
@if (isLoading()) {
  <div class="loading">Carregando clientes...</div>
} @else if (erro()) {
  <div class="error">
    {{ erro() }}
    <button (click)="clienteService.listar()">Tentar novamente</button>
  </div>
} @else {
  <div>{{ mensagemLista() }}</div>
  
  @for (cliente of clientes(); track cliente.id) {
    <app-cliente-item [cliente]="cliente" />
  } @empty {
    <div>Nenhum cliente encontrado</div>
  }
}
```

## Benefícios da Abordagem Reativa

### ✅ **Declarativo vs Imperativo**
- **Antes**: "Carregue dados, depois atualize o signal"
- **Depois**: "Os dados são sempre atuais"

### ✅ **Single Source of Truth**
- Estado centralizado no serviço
- Componentes apenas consomem dados
- Não há duplicação de estado

### ✅ **Atualizações Automáticas**
- CRUD operations atualizam estado automaticamente
- Componentes reagem automaticamente às mudanças
- Zero sincronização manual

### ✅ **Melhor Performance**
- OnPush change detection funciona perfeitamente
- Computed signals são memoizados
- Renderização mínima apenas quando necessário

### ✅ **Experiência do Usuário**
- Loading states automáticos
- Error handling centralizado
- Feedback visual imediato

### ✅ **Código Mais Limpo**
- Menos código boilerplate
- Não precisa de ngOnInit para dados
- Lógica de negócio no serviço
- UI logic no componente

### ✅ **Testabilidade**
- Estado previsível
- Fácil de mockar signals
- Testes mais simples

## Padrão Para Outros Módulos

Este mesmo padrão pode ser aplicado para:

- `ProdutoService` ✅ (já refatorado)
- `FornecedorService`
- `VendaService`
- Qualquer serviço que gerencie estado

### Template do Padrão

```typescript
@Injectable({ providedIn: 'root' })
export class [Entity]Service {
  // Estado interno
  private _data = signal<[Entity][] | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Signals públicos
  readonly data = computed(() => this._data() || []);
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Métodos reativos
  load(): void { /* carregar dados */ }
  add(item: [Entity]): Observable<[Entity]> { /* adicionar + atualizar estado */ }
  update(id: number, item: [Entity]): Observable<[Entity]> { /* atualizar + estado */ }
  delete(id: number): Observable<void> { /* deletar + estado */ }
}
```

## Migração Gradual

1. **Manter compatibilidade**: Métodos tradicionais ainda funcionam
2. **Migrar componente por componente**: Começar com lista principal
3. **Testar incrementalmente**: Verificar se tudo funciona
4. **Remover código legado**: Após confirmação

Esta refatoração cria uma base sólida para aplicações Angular modernas, aproveitando ao máximo o poder dos signals e criando uma experiência de desenvolvimento mais produtiva e maintível.
