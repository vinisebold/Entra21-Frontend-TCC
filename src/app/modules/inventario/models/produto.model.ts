import { FornecedorModel } from '../../cadastros/models/fornecedor.model';

export type AcabamentoProduto =
  | 'DOURADO'
  | 'BANHO_DOURADO'
  | 'PRATA'
  | 'BANHO_PRATA'
  | 'ACO';
export type StatusProduto = 'EM_ESTOQUE' | 'VENDIDO';

export interface ProdutoModel {
  id?: number;
  nome: string;
  precoVenda: number | null;
  precoCusto: number;
  categoria: string;
  acabamento: AcabamentoProduto;
  idReferencia: string;
  idFornecedor: number;
  fornecedor?: FornecedorModel;
  status?: StatusProduto;
}
