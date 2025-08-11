import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.html',
  host: {
    class: 'block bg-[#F4F3F1] h-full transition-all duration-200 ease-in-out',
    '[class.w-56]': '!collapsed()',
    '[class.w-16]': 'collapsed()',
  },
})
export class NavBar {
  private readonly storageKey = 'sidebar-collapsed';

  // Estado local com sinais
  readonly userName = signal('Guest User');
  readonly collapsed = signal<boolean>(this.hydrateCollapsed());

  // Menu
  readonly menuItems = [
    { label: 'Início', route: '/inicio', icon: '/sprite.svg#icon-home' },
    {
      label: 'Inventário',
      route: '/inventario',
      icon: '/sprite.svg#icon-inventario',
    },
    { label: 'Cadastro', route: '/cadastro', icon: '/sprite.svg#icon-pessoas' },
    {
      label: 'Financeiro',
      route: '/financeiro',
      icon: '/sprite.svg#icon-dinheiro',
    },
  ] as const;

  toggle(): void {
    this.collapsed.update((v) => !v);
    this.persistCollapsed();
  }

  private hydrateCollapsed(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === '1';
    } catch {
      return false;
    }
  }

  private persistCollapsed(): void {
    try {
      localStorage.setItem(this.storageKey, this.collapsed() ? '1' : '0');
    } catch {}
  }
}
