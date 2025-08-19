import { FornecedorModel } from "../../cadastros/models/fornecedor.model";

export interface ProdutoModel {
  id?: number;

  nome: string;

  precoVenda: number | null;

  precoCusto: number;

  acabamento: number;

  codigoFornecedor: string;

  categoria: string;

  fornecedorId: number;

  fornecedor?: FornecedorModel;
}