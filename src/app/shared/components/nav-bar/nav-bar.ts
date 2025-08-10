import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="w-48 bg-[#F4F3F1]">
      <nav>
        <div class="flex items-center justify-between p-3 mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style="background-color: #9fa86d"
            >
              {{ userInitials() }}
            </div>
            <span class="text-gray-800 text-sm font-medium">{{ userName() }}</span>
          </div>
          <div
            class="px-2 py-1 rounded text-xs font-medium"
            style="background-color: #e5e5e5; color: #666666"
          >
            IC
          </div>
        </div>

        <div class="space-y-2 p-2">
          @for (item of menuItems; track item.route) {
            <div
              class="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors text-on-surface-variant"
              routerLink="{{ item.route }}"
              routerLinkActive="bg-primary text-white"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              <span class="text-sm title-medium">{{ item.label }}</span>
              <svg class="icone">
                <use [attr.href]="item.icon"></use>
              </svg>
            </div>
          }
        </div>
      </nav>
    </div>
  `,
})
export class NavBar {
  // Signals para reatividade
  userName = signal('Guest User');
  userInitials = signal('GU');

  // Menu dinâmico como array
  menuItems = [
    { label: 'Início', route: '/inicio', icon: '/sprite.svg#icon-home' },
    { label: 'Inventário', route: '/inventario', icon: '/sprite.svg#icon-inventario' },
    { label: 'Cadastro', route: '/cadastro', icon: '/sprite.svg#icon-pessoas' },
    { label: 'Financeiro', route: '/financeiro', icon: '/sprite.svg#icon-dinheiro' },
  ];
}