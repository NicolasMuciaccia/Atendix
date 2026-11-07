import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Page, errorMessageOf } from '../../../core/api/api';
import { Role, User } from '../../../core/auth/auth.models';
import { CreateUserRequest, UserService } from '../data/user.service';

@Injectable()
export class UsersStore {
  private readonly userService = inject(UserService);

  private readonly _page = signal<Page<User> | null>(null);
  private readonly _pageNumber = signal(0);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly users = computed(() => this._page()?.content ?? []);
  readonly totalElements = computed(() => this._page()?.totalElements ?? 0);
  readonly currentPage = computed(() => this._page()?.page ?? 0);
  readonly totalPages = computed(() => this._page()?.totalPages ?? 0);

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._page.set(await firstValueFrom(this.userService.list(this._pageNumber())));
    } catch (error) {
      this._error.set(errorMessageOf(error));
    } finally {
      this._loading.set(false);
    }
  }

  async goToPage(page: number): Promise<void> {
    this._pageNumber.set(page);
    await this.load();
  }

  async create(request: CreateUserRequest): Promise<User> {
    const user = await firstValueFrom(this.userService.create(request));
    await this.load();
    return user;
  }

  async changeRole(userId: string, role: Role): Promise<void> {
    const updated = await firstValueFrom(this.userService.changeRole(userId, role));
    this._page.update(page => page && {
      ...page,
      content: page.content.map(user => (user.id === updated.id ? updated : user)),
    });
  }

  async resetPassword(userId: string): Promise<void> {
    await firstValueFrom(this.userService.resetPassword(userId));
    await this.load();
  }
}
