import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore } from '../core/auth/auth.store';
import { Icon } from '../shared/ui/icon';
import { ThemeToggle } from '../shared/ui/theme-toggle';
import { AccountMenu } from './account-menu';

/** Signed-in frame: sidebar on desktop, bottom navigation with the "new ticket" action on mobile. */
@Component({
  selector: 'atx-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, ThemeToggle, AccountMenu],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly isAdmin = inject(AuthStore).isAdmin;
}
