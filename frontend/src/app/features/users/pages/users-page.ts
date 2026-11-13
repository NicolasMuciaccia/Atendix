import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { errorMessageOf, fieldErrorsOf } from '../../../core/api/api';
import { INITIAL_PASSWORD, ROLE_LABELS, Role, User } from '../../../core/auth/auth.models';
import { AuthStore } from '../../../core/auth/auth.store';
import { DateTimePipe } from '../../../shared/format/dates';
import { Avatar } from '../../../shared/ui/avatar';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { IconButton } from '../../../shared/ui/icon-button';
import { EmptyState, ErrorState } from '../../../shared/ui/states';
import { Tag } from '../../../shared/ui/tag';
import { ToastService } from '../../../shared/ui/toast';
import { UserFormDialog } from '../components/user-form-dialog';
import { CreateUserRequest } from '../data/user.service';
import { UsersStore } from '../store/users.store';

const SKELETON_ROWS = [0, 1, 2, 3];

@Component({
  selector: 'atx-users-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UsersStore],
  imports: [Avatar, Button, Dialog, IconButton, EmptyState, ErrorState, Tag, UserFormDialog, DateTimePipe],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {
  protected readonly store = inject(UsersStore);
  private readonly authStore = inject(AuthStore);
  private readonly toast = inject(ToastService);

  protected readonly roles: Role[] = ['COMMON', 'ADMIN'];
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly skeletonRows = SKELETON_ROWS;
  protected readonly initialPassword = INITIAL_PASSWORD;
  protected readonly currentUserId = computed(() => this.authStore.user()?.id);
  protected readonly pageLabel = computed(() => `Página ${this.store.currentPage() + 1} de ${this.store.totalPages()}`);

  protected readonly formOpen = signal(false);
  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly createFieldErrors = signal<Record<string, string>>({});
  protected readonly createdUser = signal<User | null>(null);
  protected readonly resetTarget = signal<User | null>(null);
  protected readonly deactivateTarget = signal<User | null>(null);
  protected readonly pendingUserId = signal<string | null>(null);

  constructor() {
    void this.store.load();
  }

  protected openForm(): void {
    this.createError.set(null);
    this.createFieldErrors.set({});
    this.formOpen.set(true);
  }

  protected async createUser(request: CreateUserRequest): Promise<void> {
    this.creating.set(true);
    this.createError.set(null);
    this.createFieldErrors.set({});
    try {
      const user = await this.store.create(request);
      this.formOpen.set(false);
      this.createdUser.set(user);
    } catch (error) {
      this.createError.set(errorMessageOf(error));
      this.createFieldErrors.set(fieldErrorsOf(error));
    } finally {
      this.creating.set(false);
    }
  }

  protected async changeRole(user: User, role: string): Promise<void> {
    this.pendingUserId.set(user.id);
    try {
      await this.store.changeRole(user.id, role as Role);
      this.toast.show(`Perfil de ${user.name} alterado para ${ROLE_LABELS[role as Role]}.`);
    } catch (error) {
      this.toast.show(errorMessageOf(error), 'danger');
      await this.store.load();
    } finally {
      this.pendingUserId.set(null);
    }
  }

  /** Deactivating ends the person's sessions, so it asks first; reactivating does not. */
  protected toggleActive(user: User): void {
    if (user.active) {
      this.deactivateTarget.set(user);
      return;
    }
    void this.changeActive(user, true);
  }

  protected async confirmDeactivate(): Promise<void> {
    const user = this.deactivateTarget();
    this.deactivateTarget.set(null);
    if (user) {
      await this.changeActive(user, false);
    }
  }

  private async changeActive(user: User, active: boolean): Promise<void> {
    this.pendingUserId.set(user.id);
    try {
      await this.store.changeActive(user.id, active);
      this.toast.show(active ? `Conta de ${user.name} reativada.` : `Conta de ${user.name} desativada.`);
    } catch (error) {
      this.toast.show(errorMessageOf(error), 'danger');
    } finally {
      this.pendingUserId.set(null);
    }
  }

  protected async confirmReset(): Promise<void> {
    const user = this.resetTarget();
    this.resetTarget.set(null);
    if (!user) {
      return;
    }

    this.pendingUserId.set(user.id);
    try {
      await this.store.resetPassword(user.id);
      this.toast.show(`Senha de ${user.name} redefinida para a inicial.`);
    } catch (error) {
      this.toast.show(errorMessageOf(error), 'danger');
    } finally {
      this.pendingUserId.set(null);
    }
  }
}
