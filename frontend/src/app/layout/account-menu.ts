import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, signal } from '@angular/core';
import { ROLE_LABELS } from '../core/auth/auth.models';
import { AuthStore } from '../core/auth/auth.store';
import { MAX_SESSION_SLOTS, NEW_ACCOUNT_PARAM, SessionSlots } from '../core/auth/session-slots';
import { ThemeStore } from '../core/theme/theme.store';
import { Avatar } from '../shared/ui/avatar';
import { Icon } from '../shared/ui/icon';

export type AccountMenuPlacement = 'sidebar' | 'bottom-nav';

const NEW_ACCOUNT_URL = `/login?${NEW_ACCOUNT_PARAM}=1`;

/**
 * Who is signed in on this tab, with the other accounts of the browser to switch to, the way to
 * sign in with one more account in a new tab, the theme and the logout.
 */
@Component({
  selector: 'atx-account-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Icon],
  host: {
    '[class]': '"placement-" + placement()',
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'open.set(false)',
  },
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.scss',
})
export class AccountMenu {
  readonly placement = input<AccountMenuPlacement>('sidebar');

  private readonly authStore = inject(AuthStore);
  private readonly sessionSlots = inject(SessionSlots);
  private readonly themeStore = inject(ThemeStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly open = signal(false);
  protected readonly user = this.authStore.user;
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly otherAccounts = this.sessionSlots.otherAccounts;
  protected readonly canAddAccount = this.sessionSlots.canAddAccount;
  protected readonly maxAccounts = MAX_SESSION_SLOTS;
  protected readonly isDark = computed(() => this.themeStore.theme() === 'dark');

  protected toggle(): void {
    this.open.update(open => !open);
  }

  protected switchTo(slot: number): void {
    this.open.set(false);
    void this.authStore.switchAccount(slot);
  }

  protected addAccount(): void {
    this.open.set(false);
    window.open(NEW_ACCOUNT_URL, '_blank', 'noopener');
  }

  protected toggleTheme(): void {
    this.themeStore.toggle();
  }

  protected logout(): void {
    this.open.set(false);
    void this.authStore.logout();
  }

  protected closeOnOutsideClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
