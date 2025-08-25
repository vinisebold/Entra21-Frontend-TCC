import { FornecedorModel } from '@modules/cadastros';

// Jackson default for Java LocalDateTime can serialize as an array:
// [year, month, day, hour, minute, second, nano]
export type LocalDateTimeArray = [
  number, // year
  number, // month (1-12)
  number, // day
  number, // hour
  number, // minute
  number, // second
  number // nano
];

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
  dataCriacao?: string | LocalDateTimeArray;
  dataAtualizacao?: string | LocalDateTimeArray;
}
