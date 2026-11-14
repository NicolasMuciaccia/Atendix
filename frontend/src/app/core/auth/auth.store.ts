import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordRequest, LoginRequest, User } from './auth.models';
import { FIRST_ACCESS_PATH, HOME_PATH, LOGIN_PATH } from './auth.paths';
import { AuthService } from './auth.service';
import { SessionChannel, SessionEvent } from './session-channel';
import { NEW_ACCOUNT_PARAM, SessionSlots } from './session-slots';

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous';

const UNAUTHORIZED = 401;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sessionChannel = inject(SessionChannel);
  private readonly sessionSlots = inject(SessionSlots);

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
   * Runs at startup. A tab opened by "Entrar com outra conta" starts on a free slot, anonymous;
   * any other tab recovers the session of its slot.
   */
  async start(url: URL): Promise<void> {
    if (url.searchParams.has(NEW_ACCOUNT_PARAM) && this.sessionSlots.claimFreeSlot()) {
      await firstValueFrom(this.authService.issueCsrfToken());
      this.endSession();
      return;
    }
    await this.restoreSession();
  }

  /** Puts this tab on another account already signed in on the browser. */
  async switchAccount(slot: number): Promise<void> {
    this.sessionSlots.switchTo(slot);
    await this.restoreSession();
    const user = this._user();
    await this.router.navigateByUrl(user ? this.homeOf(user) : LOGIN_PATH);
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
    this.publishSignedIn(user);
    return user;
  }

  async changePassword(request: ChangePasswordRequest): Promise<User> {
    const user = await firstValueFrom(this.authService.changePassword(request));
    this.startSession(user);
    this.publishSignedIn(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout());
    } finally {
      this.endSession();
      this.sessionChannel.publish({ type: 'signed-out', slot: this.sessionSlots.current() });
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
    if (event.slot !== this.sessionSlots.current()) {
      return;
    }
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
    await this.router.navigateByUrl(this.homeOf(currentUser));
  }

  private homeOf(user: User): string {
    return user.mustChangePassword ? FIRST_ACCESS_PATH : HOME_PATH;
  }

  private publishSignedIn(user: User): void {
    this.sessionChannel.publish({ type: 'signed-in', slot: this.sessionSlots.current(), userId: user.id });
  }

  private startSession(user: User): void {
    this._user.set(user);
    this._status.set('authenticated');
    this.sessionSlots.remember(user);
  }

  private endSession(): void {
    this._user.set(null);
    this._status.set('anonymous');
    this.sessionSlots.forgetCurrent();
  }
}
