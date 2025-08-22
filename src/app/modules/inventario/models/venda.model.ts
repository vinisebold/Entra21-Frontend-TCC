/**
 * Interface para o PAYLOAD que enviamos para a API.
 * Corresponde aos campos de ENTRADA do RegistrarVendaDTO.
 */
export interface RegistrarVendaPayload {
    nomeCliente: string;
    situacao: number; // 0 para Pendente, 1 para Pago
    formaPagamento: number; // 1: PIX, 2: Dinheiro, 3: Crédito, 4: Débito
    numeroParcelas?: number;
  }
  
  /**
   * Interface para a RESPOSTA que recebemos da API.
   * Corresponde aos campos de SAÍDA do RegistrarVendaDTO.
   */
  export interface VendaRecibo {
    id: number;
    nome: string;
    precoTotalVenda: number;
    itens: ItemVendido[];
    dataCriacao: string;
  }
  
  export interface ItemVendido {
    id: number;
    produtoOriginalId: number;
    nome: string;
    precoVenda: number;
    lucro: number;
    dataVenda: string;
    categoria: string;
  }