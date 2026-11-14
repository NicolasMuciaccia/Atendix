import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { User } from './auth.models';
import { AuthStore } from './auth.store';
import { SessionChannel, SessionEvent } from './session-channel';
import { SESSION_SLOT_HEADER, SessionSlots } from './session-slots';
import { sessionSlotInterceptor } from './session-slot.interceptor';
import { withInterceptors } from '@angular/common/http';

const ADMIN: User = {
  id: 'u-admin', name: 'Administrador', login: 'admin', role: 'ADMIN',
  mustChangePassword: false, active: true, createdAt: '2026-11-07T12:00:00Z',
};
const COMMON: User = { ...ADMIN, id: 'u-common', name: 'Usuário Comum', login: 'usuario', role: 'COMMON' };

/** Stands in for the BroadcastChannel: lets the test play the role of another tab. */
class FakeSessionChannel {
  readonly published: SessionEvent[] = [];
  private handler: ((event: SessionEvent) => void) | null = null;

  publish(event: SessionEvent): void {
    this.published.push(event);
  }

  listen(handler: (event: SessionEvent) => void): void {
    this.handler = handler;
  }

  fromOtherTab(event: SessionEvent): void {
    this.handler?.(event);
  }
}

describe('AuthStore', () => {
  let store: AuthStore;
  let backend: HttpTestingController;
  let channel: FakeSessionChannel;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([sessionSlotInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SessionChannel, useClass: FakeSessionChannel },
      ],
    });
    store = TestBed.inject(AuthStore);
    backend = TestBed.inject(HttpTestingController);
    channel = TestBed.inject(SessionChannel) as unknown as FakeSessionChannel;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => backend.verify());

  async function signIn(user: User): Promise<void> {
    const login = store.login({ login: user.login, password: 'x' });
    backend.expectOne('/api/v1/auth/csrf').flush(null);
    await Promise.resolve();
    backend.expectOne('/api/v1/auth/login').flush(user);
    await login;
  }

  async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve));
  }

  it('should tell the other tabs about a new sign-in', async () => {
    await signIn(ADMIN);

    expect(channel.published).toEqual([{ type: 'signed-in', slot: 0, userId: ADMIN.id }]);
  });

  it('should list the signed-in account for the other tabs of the browser', async () => {
    await signIn(ADMIN);

    expect(TestBed.inject(SessionSlots).accounts()).toEqual([
      { slot: 0, userId: ADMIN.id, name: ADMIN.name, login: ADMIN.login },
    ]);
  });

  it('should ignore a sign-out of another account of the browser', async () => {
    await signIn(ADMIN);

    channel.fromOtherTab({ type: 'signed-out', slot: 1 });
    await settle();

    expect(store.status()).toBe('authenticated');
  });

  it('should open a tab for another account on a free slot, signed out', async () => {
    await signIn(ADMIN);

    const start = store.start(new URL('http://localhost/login?nova-conta=1'));
    backend.expectOne('/api/v1/auth/csrf').flush(null);
    await start;

    expect(TestBed.inject(SessionSlots).current()).toBe(1);
    expect(store.status()).toBe('anonymous');
    const login = store.login({ login: COMMON.login, password: 'x' });
    backend.expectOne('/api/v1/auth/csrf').flush(null);
    await Promise.resolve();
    const request = backend.expectOne('/api/v1/auth/login');
    expect(request.request.headers.get(SESSION_SLOT_HEADER)).toBe('1');
    request.flush(COMMON);
    await login;
    expect(TestBed.inject(SessionSlots).accounts().map(account => account.login)).toEqual(['admin', 'usuario']);
  });

  it('should leave the workspace when another tab signs out', async () => {
    await signIn(ADMIN);

    channel.fromOtherTab({ type: 'signed-out', slot: 0 });
    await settle();

    expect(store.status()).toBe('anonymous');
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/login');
  });

  it('should switch to the account another tab signed in with', async () => {
    await signIn(ADMIN);

    channel.fromOtherTab({ type: 'signed-in', slot: 0, userId: COMMON.id });
    await settle();
    backend.expectOne('/api/v1/auth/csrf').flush(null);
    await settle();
    backend.expectOne('/api/v1/users/me').flush(COMMON);
    await settle();

    expect(store.user()).toEqual(COMMON);
    expect(store.isAdmin()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/chamados');
  });
});
