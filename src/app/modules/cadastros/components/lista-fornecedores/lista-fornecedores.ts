import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { Botao } from '../../../../shared/components/botao/botao';
import { FormularioFornecedor } from '../../../cadastros/components/formulario-fornecedor/formulario-fornecedor';
import { FornecedorItem } from '../fornecedor-item/fornecedor-item';
import { FornecedorModel } from '../../models/fornecedor.model';
import { FornecedorService } from '../../services/fornecedor.service';

@Component({
  selector: 'app-lista-fornecedores',
  imports: [Botao, FormularioFornecedor, FornecedorItem],
  templateUrl: './lista-fornecedores.html',
  styleUrl: './lista-fornecedores.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaFornecedores implements OnInit {
  private fornecedorService = inject(FornecedorService);
  fornecedores = signal<FornecedorModel[]>([]);
  mostrarModalFornecedor = signal(false);

  // ngOnInit é chamado uma vez quando o componente é criado
  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe((dados) => {
      this.fornecedores.set(dados);
    });
  }

  deletarFornecedor(id: number): void {
    this.fornecedorService.deleteFornecedor(id).subscribe(() => {
      this.fornecedores.update((lista: FornecedorModel[]) => lista.filter((f : FornecedorModel) => f.id !== id));
    });
  }

  // --- MÉTODOS PARA O MODAL ---
  abrirFornecedorModal(): void {
    this.mostrarModalFornecedor.set(true);
  }

  closeFornecedorModal(): void {
    this.mostrarModalFornecedor.set(false);
  }

  // Este método é chamado quando o formulário avisa que salvou um novo fornecedor
  onFornecedorSalvo(): void {
    this.closeFornecedorModal();
    this.carregarFornecedores();
  }
}
