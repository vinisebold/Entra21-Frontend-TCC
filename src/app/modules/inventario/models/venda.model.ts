import { ProdutoModel } from './produto.model';

export type StatusVenda = 'PENDENTE' | 'PAGO' | 'CANCELADA';
export type FormaPagamento =
  | 'PIX'
  | 'DINHEIRO'
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO';

/**
 * Interface para o PAYLOAD que enviamos para registrar uma nova venda.
 * Corresponde ao `RegistrarVendaRequestDto` do backend.
 */
export interface RegistrarVendaRequest {
  produtoId: number;
  clienteId: number;
  precoVenda: number;
  formaPagamento: FormaPagamento;
  totalParcelas: number;
  status: StatusVenda;
  dataVencimento?: string;
}

/**
 * Interface para a RESPOSTA que recebemos da API ao buscar uma venda.
 * Corresponde ao `VendaResponseDto` do backend.
 */
export interface VendaResponse {
  id: number;
  produto: ProdutoModel;
  clienteId: number;
  nomeCliente: string;
  precoVenda: number;
  lucro: number;
  formaPagamento: FormaPagamento;
  status: StatusVenda;
  totalParcelas: number;
  parcelasPagas: number;
  dataVencimento: string | null;
  dataCriacao: string;
}
