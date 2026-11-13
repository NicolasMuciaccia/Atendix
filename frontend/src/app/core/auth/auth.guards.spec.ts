import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { adminGuard, firstAccessGuard, guestGuard, workspaceGuard } from './auth.guards';
import { User } from './auth.models';
import { AuthStore } from './auth.store';

const COMMON_USER: User = {
  id: 'b1c2', name: 'Usuário Comum', login: 'usuario', role: 'COMMON',
  mustChangePassword: false, active: true, createdAt: '2026-11-07T12:00:00Z',
};

describe('auth guards', () => {
  let authStore: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    authStore = TestBed.inject(AuthStore);
  });

  function run(guard: CanActivateFn): boolean | string {
    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));
    return result instanceof UrlTree ? TestBed.inject(Router).serializeUrl(result) : (result as boolean);
  }

  async function signIn(user: User): Promise<void> {
    const backend = TestBed.inject(HttpTestingController);
    const login = authStore.login({ login: user.login, password: 'x' });
    backend.expectOne('/api/v1/auth/csrf').flush(null);
    await Promise.resolve();
    backend.expectOne('/api/v1/auth/login').flush(user);
    await login;
  }

  it('should send anonymous visitors to the login', () => {
    expect(run(workspaceGuard)).toBe('/login');
  });

  it('should hold users with the initial password on the first-access screen', async () => {
    await signIn({ ...COMMON_USER, mustChangePassword: true });

    expect(run(workspaceGuard)).toBe('/primeiro-acesso');
    expect(run(firstAccessGuard)).toBe(true);
  });

  it('should let released users into the workspace and away from the login', async () => {
    await signIn(COMMON_USER);

    expect(run(workspaceGuard)).toBe(true);
    expect(run(guestGuard)).toBe('/chamados');
    expect(run(firstAccessGuard)).toBe('/chamados');
  });

  it('should keep common users out of the administration', async () => {
    await signIn(COMMON_USER);

    expect(run(adminGuard)).toBe('/chamados');
  });

  it('should let administrators into the administration', async () => {
    await signIn({ ...COMMON_USER, role: 'ADMIN' });

    expect(run(adminGuard)).toBe(true);
  });
});
