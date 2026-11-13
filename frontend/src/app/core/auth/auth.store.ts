import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordRequest, LoginRequest, User } from './auth.models';
import { FIRST_ACCESS_PATH, HOME_PATH, LOGIN_PATH } from './auth.paths';
import { AuthService } from './auth.service';
import { SessionChannel, SessionEvent } from './session-channel';

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';

const UNAUTHORIZED = 401;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sessionChannel = inject(SessionChannel);

  private readonly _user = signal<User | null>(null);
  private readonly _status = signal<SessionStatus>('unknown');

  readonly user = this._user.asReadonly();
  readonly status = this._status.asReadonly();
  readonly isAuthenticated = computed(() => this._status() === 'authenticated');
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');
  readonly mustChangePassword = computed(() => this._user()?.mustChangePassword ?? false);

  constructor() {
    this.sessionChannel.listen(event => void this.followOtherTab(event));
  }

  /**
   * Recovers a session kept in the auth cookies (at startup, or when another tab signs in). Any
   * failure (no session, server down) leaves the app on the login screen, where signing in reports
   * the actual problem instead of the app failing to start.
   */
  async restoreSession(): Promise<void> {
    try {
      await firstValueFrom(this.authService.issueCsrfToken());
      this.startSession(await firstValueFrom(this.authService.currentUser()));
    } catch (error) {
      if (!(error instanceof HttpErrorResponse && error.status === UNAUTHORIZED)) {
        console.warn('Atendix: session could not be restored', error);
      }
      this.endSession();
    }
  }

  async login(request: LoginRequest): Promise<User> {
    // Ensures the XSRF-TOKEN cookie exists even if the startup request could not get it
    await firstValueFrom(this.authService.issueCsrfToken());
    const user = await firstValueFrom(this.authService.login(request));
    this.startSession(user);
    this.sessionChannel.publish({ type: 'signed-in', userId: user.id });
    return user;
  }

  async changePassword(request: ChangePasswordRequest): Promise<User> {
    const user = await firstValueFrom(this.authService.changePassword(request));
    this.startSession(user);
    this.sessionChannel.publish({ type: 'signed-in', userId: user.id });
    return user;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout());
    } finally {
      this.endSession();
      this.sessionChannel.publish({ type: 'signed-out' });
      await this.router.navigateByUrl(LOGIN_PATH);
    }
  }

  /** Called by the refresh interceptor with the user returned by a renewed session. */
  sessionRenewed(user: User): void {
    this.startSession(user);
  }

  /** Called when the session can no longer be renewed: drops it and sends the user to the login. */
  async sessionExpired(): Promise<void> {
    const wasAuthenticated = this.isAuthenticated();
    this.endSession();
    if (wasAuthenticated) {
      await this.router.navigateByUrl(LOGIN_PATH);
    }
  }

  private async followOtherTab(event: SessionEvent): Promise<void> {
    if (event.type === 'signed-out') {
      await this.sessionExpired();
      return;
    }

    const previousUserId = this._user()?.id;
    await this.restoreSession();
    const currentUser = this._user();
    // Same person (e.g. a renewed session in another tab): nothing to change here
    if (!currentUser || currentUser.id === previousUserId) {
      return;
    }
    await this.router.navigateByUrl(currentUser.mustChangePassword ? FIRST_ACCESS_PATH : HOME_PATH);
  }

  private startSession(user: User): void {
    this._user.set(user);
    this._status.set('authenticated');
  }

  private endSession(): void {
    this._user.set(null);
    this._status.set('anonymous');
  }
}
