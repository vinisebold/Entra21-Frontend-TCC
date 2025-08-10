# Entra21FrontendTcc


# Estrutura Frontend

src/
└── app/
    ├── core/
    │   ├── layout/
    │   ├── services/
    │   │   ├── notificacao.service.ts
    │   │   └── contexto-fornecedor.service.ts
    │   └── auth/
    │
    ├── modules/
    │   ├── inicio/
    │   │   └── pages/
    │   │       └── dashboard/
    │   │
    │   ├── inventario/
    │   │   ├── components/
    │   │   │   ├── formulario-produto/
    │   │   │   └── registro-venda/
    │   │   ├── models/
    │   │   │   └── produto.model.ts
    │   │   ├── pages/
    │   │   │   └── lista-produtos/
    │   │   └── services/
    │   │       └── produto-api.service.ts
    │   │
    │   ├── cadastros/
    │   │   ├── components/
    │   │   │   ├── formulario-cliente/
    │   │   │   ├── formulario-fornecedor/
    │   │   │   ├── lista-clientes/
    │   │   │   └── lista-fornecedores/
    │   │   ├── models/
    │   │   │   └── contato.model.ts
    │   │   └── pages/
    │   │       └── pagina-cadastros/
    │   │
    │   └── financeiro/
    │       ├── components/
    │       │   ├── lista-vendas-pendentes/
    │       │   └── lista-vendas-quitadas/
    │       ├── models/
    │       │   └── venda.model.ts
    │       └── pages/
    │           └── controle-vendas/
    │
    └── shared/
        └── components/
            ├── botao/
            ├── barra-pesquisa/
            └── modal/