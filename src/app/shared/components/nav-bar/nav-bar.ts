import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block bg-surface-container h-full transition-all duration-300 ease-out',
    '[class.w-56]': '!collapsed()',
    '[class.w-18]': 'collapsed()',
    '[class.is-collapsed]': 'collapsed()',
  },
})
export class NavBar {
  private readonly storageKey = 'sidebar-collapsed';

  readonly userName = signal('Usuario');
  readonly collapsed = signal<boolean>(this.hydrateCollapsed());
  readonly logoHovered = signal(false);

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

  // Será chamado ao clicar no fundo da nav.
  expandOnBackgroundClick(): void {
    if (this.collapsed()) {
      this.toggle();
    }
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
