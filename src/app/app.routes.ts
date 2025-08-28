import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
  pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.Landing),
  },

  {
    path: '',
    component: Layout,
    children: [

      {
        path: 'inicio',
        loadComponent: () =>
          import('./modules/inicio/pages/pagina-inicio/pagina-inicio').then(
            (m) => m.PaginaInicio
          ),
      },

      {
        path: 'inventario',
        loadComponent: () =>
          import(
            './modules/inventario/pages/pagina-inventario/pagina-inventario'
          ).then((m) => m.PaginaInventario),
      },

      {
        path: 'cadastro',
        loadComponent: () =>
          import(
            './modules/cadastros/pages/pagina-cadastros/pagina-cadastros'
          ).then((m) => m.PaginaCadastros),
      },

      {
        path: 'financeiro',
        loadComponent: () =>
          import(
            './modules/financeiro/pages/pagina-financeiro/pagina-financeiro'
          ).then((m) => m.PaginaFinanceiro),
      },
    ],
  },
];
