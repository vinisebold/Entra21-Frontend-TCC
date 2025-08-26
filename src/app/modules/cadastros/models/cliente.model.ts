export interface ClienteModel {
  id: number;
  nome: string;
  descricao: string;
  telefone: string;
  email?: string | null;
  cpf?: string | null;
  dataCriacao?: string | null;
  dataAtualizacao?: string | null;
}
