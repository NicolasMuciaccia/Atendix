import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROLE_LABELS } from '../core/auth/auth.models';
import { AuthStore } from '../core/auth/auth.store';
import { Avatar } from '../shared/ui/avatar';
import { Icon } from '../shared/ui/icon';
import { IconButton } from '../shared/ui/icon-button';

/** Signed-in frame: navy sidebar on desktop, bottom navigation with the "new ticket" action on mobile. */
@Component({
  selector: 'atx-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar, Icon, IconButton],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly authStore = inject(AuthStore);

  protected readonly user = this.authStore.user;
  protected readonly isAdmin = this.authStore.isAdmin;
  protected readonly roleLabels = ROLE_LABELS;

  protected logout(): void {
    void this.authStore.logout();
  }
}
