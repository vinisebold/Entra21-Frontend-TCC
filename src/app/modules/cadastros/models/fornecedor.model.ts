export interface FornecedorModel {
  id: number;
  nome: string;
  descricao: string;
  telefone: string;
  cnpj: string;
  dataCriacao?: string | null;
  dataAtualizacao?: string | null;
  codigoAnel?: string;
  codigoBracelete?: string;
  codigoColar?: string;
  codigoBrinco?: string;
  codigoPulseira?: string;
  codigoPingente?: string;
  codigoConjunto?: string;
  codigoBerloque?: string;
  codigoPiercing?: string;
}
