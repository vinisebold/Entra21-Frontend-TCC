import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

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
export class ListaFornecedores implements OnInit{
// 1. Injeta o serviço para buscar os dados da API
  private fornecedorService = inject(FornecedorService);

  // 2. Cria um signal para guardar a lista de fornecedores vinda da API
  fornecedores = signal<FornecedorModel[]>([]);

  // 3. Substituímos a variável booleana por um signal. É o nosso "interruptor".
  mostrarModalFornecedor = signal(false);

  // ngOnInit é chamado uma vez quando o componente é criado
  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe((dados) => {
      this.fornecedores.set(dados); // Atualiza o signal com os dados da API
    });
  }

  // --- MÉTODOS PARA O MODAL ---
  abrirFornecedorModal(): void {
    this.mostrarModalFornecedor.set(true); // Liga o interruptor
  }

  closeFornecedorModal(): void {
    this.mostrarModalFornecedor.set(false); // Desliga o interruptor
  }

  // Este método é chamado quando o formulário avisa que salvou um novo fornecedor
  onFornecedorSalvo(): void {
    this.closeFornecedorModal(); // Fecha o modal
    this.carregarFornecedores(); // Busca a lista atualizada na API
  }
}
