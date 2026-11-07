import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icon } from '../../shared/ui/icon';

/** "Cadastros" area: one tab per registered resource, in the order they are set up. */
@Component({
  selector: 'atx-catalog-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  template: `
    <header class="topbar">
      <h1 class="title">Cadastros</h1>
      <p class="lead">Cadastre setores e etiquetas; depois ligue cada item a um setor e a uma etiqueta.</p>
    </header>
    <nav class="tabs" aria-label="Cadastros">
      <a routerLink="setores" routerLinkActive="active" ariaCurrentWhenActive="page">
        <atx-icon name="building-2" [size]="15" /> Setores
      </a>
      <a routerLink="etiquetas" routerLinkActive="active" ariaCurrentWhenActive="page">
        <atx-icon name="tag" [size]="15" /> Etiquetas
      </a>
      <a routerLink="itens" routerLinkActive="active" ariaCurrentWhenActive="page">
        <atx-icon name="layers" [size]="15" /> Itens
      </a>
    </nav>
    <div class="content"><router-outlet /></div>
  `,
  styles: `
    :host { display: flex; flex: 1; flex-direction: column; min-height: 0; }
    .topbar { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-1) var(--space-3);
              padding: var(--space-4) var(--space-6) 0; }
    .title { font-size: var(--text-xl); font-weight: var(--weight-bold); letter-spacing: -0.015em; color: var(--text-strong); }
    .lead { font-size: var(--text-sm); color: var(--text-muted); }
    .tabs { display: flex; gap: var(--space-5); padding: 0 var(--space-6); border-bottom: 1px solid var(--border-subtle); }
    .tabs a { position: relative; display: inline-flex; align-items: center; gap: var(--space-1-5); height: 44px;
              color: var(--ink-500); font-size: var(--text-base); font-weight: var(--weight-medium); }
    .tabs a:hover { color: var(--ink-900); text-decoration: none; }
    .tabs a.active { color: var(--ink-900); font-weight: var(--weight-semibold); }
    .tabs a.active::after { content: ''; position: absolute; right: -2px; bottom: -1px; left: -2px; height: 2px;
                            border-radius: 2px; background: var(--blue-500); }
    .content { flex: 1; min-height: 0; padding: var(--space-5) var(--space-6); overflow-y: auto; background: var(--bg-app); }
    @media (max-width: 959px) {
      .topbar, .tabs { padding-right: var(--space-4); padding-left: var(--space-4); }
      .content { padding: var(--space-4); }
    }
  `,
})
export class CatalogLayout {}
