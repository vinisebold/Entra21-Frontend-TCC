Documento de Arquitetura e Guia da API - Backend Gleam
A arquitetura anterior para registrar vendas, que envolvia RegistrarVendaService e ItemVendidoService, funcionava na superfície, mas continha falhas de design profundas que a tornavam ineficiente, perigosa e difícil de escalar. Vamos detalhar os problemas:
1. O Problema Central: Duplicação de Dados e Perda de Histórico
O defeito mais grave era o próprio fluxo de "vender um item".
O que acontecia: Quando um Produto era vendido, o sistema criava uma cópia de suas informações em uma nova entidade chamada ItemVendido e, em seguida, deletava o Produto original do inventário.
A Ineficiência: Duplicar dados é ineficiente. A cada venda, o sistema realizava múltiplas operações de escrita (criar ItemVendido, criar RegistrarVenda, apagar Produto) quando apenas uma criação (Venda) e uma atualização (Produto.status) eram necessárias.
O Defeito Crítico: A exclusão do produto original apagava permanentemente o seu histórico. O sistema perdia a capacidade de responder a perguntas de negócio essenciais:
"Este anel que está no estoque já foi vendido e devolvido antes?" - Impossível saber.
"Qual o tempo médio que os produtos do Fornecedor X ficam no estoque antes de serem vendidos?" - Impossível calcular, pois a data de criação original era perdida.
"Houve algum problema com a peça de ID original 123?" - Impossível rastrear, pois o registro não existia mais.
2. O Problema da Responsabilidade Dividida e Confusa
A lógica de negócio estava espalhada de forma ilógica entre múltiplas classes.
O que acontecia: Existiam as entidades RegistrarVenda (que funcionava como um "recibo") e ItemVendido (que era a cópia do produto). A lógica para criá-las estava dividida entre RegistrarVendaService e ItemVendidoService, e o ProdutoController precisava conhecer e injetar ambos os serviços para realizar uma única ação de venda.
A Ineficiência: Isso violava o Princípio da Responsabilidade Única. Uma única ação de negócio ("vender um produto") exigia a coordenação de múltiplos serviços, tornando o código mais complexo, acoplado e difícil de entender.
O Defeito Crítico: A manutenção era um pesadelo. Se uma regra de negócio de venda precisasse ser alterada, o desenvolvedor teria que caçar e modificar a lógica em múltiplos arquivos, aumentando drasticamente a chance de introduzir bugs. Não havia uma "fonte única da verdade" para a lógica de vendas.
3. O Problema dos Relacionamentos Complexos e Desnecessários
A estrutura do banco de dados era mais complexa do que o necessário.
O que acontecia: Uma venda era representada por um RegistrarVenda que tinha uma relação com um ItemVendido. E, como a regra de negócio era "uma venda por item", essa estrutura de "recibo mestre" para "múltiplos itens" era superdimensionada e nunca utilizada em seu potencial, adicionando complexidade sem benefícios.
A Ineficiência: Qualquer consulta para ver os detalhes de uma venda precisaria fazer um JOIN entre as tabelas registrar_vendas e itens_vendidos, o que é menos performático do que consultar uma única tabela vendas que já tem uma referência direta ao produto_id.
O Defeito Crítico: O modelo de dados não refletia a simplicidade da regra de negócio. Um sistema deve ser tão simples quanto possível, e a arquitetura antiga adicionava camadas de complexidade que não eram justificadas pelo problema que precisava ser resolvido.


1. As Grandes Mudanças: Antes e Agora:
A seguir, detalhamos as 4 alterações fundamentais que formam a base da nova arquitetura.
Alteração 1: O Ciclo de Vida do Produto Agora é Completo
Esta foi a mudança mais importante e impactante de todo o projeto.
Unificamos as entidades Produto e ItemVendido em uma única entidade Produto. Em vez de um produto ser apagado do inventário ao ser vendido, ele agora apenas tem seu status alterado.
Como era antes (fluxo antigo):
O inventário era a tabela produtos.
Quando um produto era vendido, o sistema criava uma cópia dos seus dados em uma tabela separada chamada itens_vendidos.
Após a cópia, o produto original era permanentemente apagado (DELETE) da tabela produtos.
Como ficou agora (fluxo novo):
Existe apenas uma tabela, produtos, que é a fonte única da verdade!
Cada produto possui um campo status (EM_ESTOQUE ou VENDIDO).
Quando um produto é vendido, o sistema cria um novo registro na tabela vendas e atualiza o status do produto na tabela produtos para VENDIDO. O produto nunca é apagado.
Se uma venda é cancelada, o status do produto simplesmente volta a ser EM_ESTOQUE.
Por que é melhor?
Rastreabilidade total: Agora temos o histórico completo de cada peça. Podemos saber quando foi cadastrada, vendida, por quanto, e se foi devolvida. Isso é impossível no modelo antigo.
Integridade dos dados: Evitamos a operação perigosa de apagar registros, que pode levar à perda de dados. Mudar um status é muito mais seguro.
Relatórios poderosos: Fica mto mais fácil de gerar relatórios complexos, como "quais peças foram mais devolvidas?" ou "qual o tempo médio de uma peça no estoque?".

Alteração 2: Fim dos números mágicos com Enums
Substituímos o uso de números Integer para representar estados (como status, acabamento, forma de pagamento) por Enums Java.
Como era antes (fluxo antigo):
O código continha constantes como public static final Integer STATUS_DISPONIVEL = 0;.
O frontend enviava { "status": 0 } e o banco de dados armazenava o número 0.
O código ficava cheio de comparações como if (produto.getStatus().equals(0)).
Como ficou agora (fluxo novo):
Criamos Enums como StatusProduto { EM_ESTOQUE, VENDIDO }.
O frontend envia um texto claro e legível: { "status": "EM_ESTOQUE" }.
O banco de dados armazena o texto "EM_ESTOQUE", tornando os dados fáceis de entender.
O código Java se torna auto explicativo: if (produto.getStatus() == StatusProduto.EM_ESTOQUE).
Por que é melhor?
Segurança de tipo: É impossível enviar um status inválido. Se o frontend enviar "qualquer_coisa", a API rejeitará a requisição automaticamente. Com números, um 99 poderia ser aceito e quebrar o sistema.
Legibilidade: O código fica infinitamente mais claro para qualquer desenvolvedor. StatusProduto.EM_ESTOQUE é muito mais expressivo do que o número 0.
Manutenção fácil: Adicionar um novo status no futuro é simples e seguro, sem risco de quebrar os dados antigos no banco.

Alteração 3: DTOs Modernos e Seguros com Records
Todos os DTOs (Data Transfer Objects), que são os "pacotes de dados" da API, foram convertidos de Classes para Records Java.
Como era antes (fluxo antigo):
Usávamos as classes com a anotação @Data do Lombok. Isso gerava muito código "escondido" (getters, setters, construtores) e criava objetos que podiam ser modificados (mutáveis).
Como ficou agora (fluxo novo):
Usamos Records, um recurso moderno do Java que é feito exatamente para isso. A definição é limpa e direta
Por que é melhor?
Código Conciso: Reduzimos dezenas de linhas de código repetitivo, tornando os DTOs muito mais fáceis de ler.
Imutabilidade: Records são imutáveis por padrão. Uma vez criados, seus dados não podem ser alterados. Isso torna o fluxo de dados muito mais previsível e seguro, evitando bugs difíceis de rastrear.
Clareza de Intenção: Fica claro que o único propósito desses objetos é transportar dados de um ponto a outro.

Alteração 4: API Inteligente com Endpoint Único e Filtros
Unificamos múltiplos endpoints de listagem em um único endpoint principal que aceita parâmetros de consulta (filtros).
Como era antes (fluxo antigo):
Existiam vários endpoints para buscar produtos:
GET /api/produtos/disponiveis para listar todos os disponíveis.
GET /api/produtos/fornecedor/{id} para listar por fornecedor.
Para cada nova necessidade de filtro, um novo endpoint precisaria ser criado.
Como Ficou Agora (fluxo novo):
Existe um único e poderoso endpoint: GET /api/produtos. A filtragem é feita via parâmetros na URL:
Para listar disponíveis de um fornecedor: ?fornecedorId=1&status=EM_ESTOQUE
Para listar todos os disponíveis: ?status=EM_ESTOQUE
Para listar todos de um fornecedor (vendidos e em estoque): ?fornecedorId=1
Por que é melhor?
Flexibilidade para o Frontend: O frontend ganha o poder de combinar filtros como quiser, sem precisar que o backend crie novos endpoints.
API Limpa e Consistente: Segue o padrão RESTful moderno. A API fica mais fácil de entender e documentar.
Manutenção Simplificada: Em vez de manter vários métodos no controller e service, mantemos apenas um que contém a lógica de filtragem, evitando duplicação de código.

3. Guia da API para o Frontend
Guia prático de como consumir os principais endpoints da nova API.
Produtos (Inventário)
Listar Produtos (com filtros):
Endpoint: GET /api/produtos
Parâmetros (opcionais): fornecedorId (Long), status (String: EM_ESTOQUE ou VENDIDO)
Exemplo: GET /api/produtos?fornecedorId=1&status=EM_ESTOQUE
Criar Novo Produto:
Endpoint: POST /api/produtos
Corpo (JSON):
JSON
{
  "nome": "Colar de Pérolas",
  "precoCusto": 75.50,
  "precoVenda": 180.00,
  "categoria": "Colar",
  "acabamento": "BANHO_DOURADO",
  "idReferencia": "777", // Apenas o código digitado
  "idFornecedor": 1
}




Outras Operações: GET /api/produtos/{id}, PUT /api/produtos/{id}, DELETE /api/produtos/{id}
Vendas (Financeiro)
Registrar Nova Venda:
Endpoint: POST /api/vendas
Corpo (JSON):
JSON
{
  "produtoId": 101,
  "clienteId": 34,
  "precoVenda": 180.00,
  "formaPagamento": "CARTAO_CREDITO",
  "totalParcelas": 3,
  "status": "PENDENTE",
  "dataVencimento": "2025-09-23" // Formato "AAAA-MM-DD"
}




Listar Vendas (com filtros):
Endpoint: GET /api/vendas
Parâmetros (opcionais): status (String: PENDENTE, PAGO ou CANCELADA)
Exemplo: GET /api/vendas?status=PENDENTE
Pagar Próxima Parcela:
Endpoint: POST /api/vendas/{id}/pagar-parcela
Cancelar uma Venda:
Endpoint: POST /api/vendas/{id}/cancelar


