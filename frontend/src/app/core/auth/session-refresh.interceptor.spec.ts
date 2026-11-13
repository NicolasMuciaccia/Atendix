import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from './auth.models';
import { AuthStore } from './auth.store';
import { sessionRefreshInterceptor } from './session-refresh.interceptor';

const TICKETS = '/api/v1/tickets';
const REFRESH = '/api/v1/auth/refresh';
const LOGIN = '/api/v1/auth/login';
const CSRF = '/api/v1/auth/csrf';
const UNAUTHORIZED = { status: 401, statusText: 'Unauthorized' };
const CSRF_REJECTED = { status: 403, statusText: 'Forbidden' };
const CSRF_ERROR_BODY = { status: 403, error: 'Token CSRF inválido', message: 'Token CSRF ausente ou inválido.' };

const USER: User = {
  id: 'b1c2', name: 'Usuário Comum', login: 'usuario', role: 'COMMON',
  mustChangePassword: false, active: true, createdAt: '2026-11-07T12:00:00Z',
};

describe('sessionRefreshInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let authStore: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([sessionRefreshInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    authStore = TestBed.inject(AuthStore);
  });

  afterEach(() => backend.verify());

  it('should renew the session and replay the request when the access token expired', async () => {
    const response = firstValueFrom(http.get(TICKETS));

    backend.expectOne(TICKETS).flush(null, UNAUTHORIZED);
    backend.expectOne(REFRESH).flush(USER);
    backend.expectOne(TICKETS).flush({ content: [] });

    expect(await response).toEqual({ content: [] });
    expect(authStore.user()).toEqual(USER);
  });

  it('should refresh only once when several requests expire together', async () => {
    const first = firstValueFrom(http.get(TICKETS));
    const second = firstValueFrom(http.get(`${TICKETS}/a1`));

    backend.expectOne(TICKETS).flush(null, UNAUTHORIZED);
    backend.expectOne(`${TICKETS}/a1`).flush(null, UNAUTHORIZED);
    backend.expectOne(REFRESH).flush(USER);
    backend.expectOne(TICKETS).flush({});
    backend.expectOne(`${TICKETS}/a1`).flush({});

    await Promise.all([first, second]);
  });

  it('should keep the session when another tab already renewed it with the same refresh token', async () => {
    const response = firstValueFrom(http.get(TICKETS));

    backend.expectOne(TICKETS).flush(null, UNAUTHORIZED);
    backend.expectOne(REFRESH).flush(null, UNAUTHORIZED);
    backend.expectOne(TICKETS).flush({ content: [] });

    expect(await response).toEqual({ content: [] });
    expect(authStore.status()).not.toBe('anonymous');
  });

  it('should end the session when the refresh token is no longer valid', async () => {
    const response = firstValueFrom(http.get(TICKETS));

    backend.expectOne(TICKETS).flush(null, UNAUTHORIZED);
    backend.expectOne(REFRESH).flush(null, UNAUTHORIZED);
    backend.expectOne(TICKETS).flush(null, UNAUTHORIZED);

    await expect(response).rejects.toMatchObject({ status: 401 });
    expect(authStore.status()).toBe('anonymous');
  });

  it('should not try to refresh when the login itself is rejected', async () => {
    const response = firstValueFrom(http.post(LOGIN, {}));

    backend.expectOne(LOGIN).flush(null, UNAUTHORIZED);

    await expect(response).rejects.toMatchObject({ status: 401 });
    backend.expectNone(REFRESH);
  });

  it('should fetch a new CSRF token and replay a request rejected by CSRF', async () => {
    const response = firstValueFrom(http.post(TICKETS, { itemId: 'i-1' }));

    backend.expectOne(TICKETS).flush(CSRF_ERROR_BODY, CSRF_REJECTED);
    backend.expectOne(CSRF).flush(null);
    backend.expectOne(TICKETS).flush({ id: 't-1' });

    expect(await response).toEqual({ id: 't-1' });
  });

  it('should replay a CSRF rejection only once', async () => {
    const response = firstValueFrom(http.post(TICKETS, {}));

    backend.expectOne(TICKETS).flush(CSRF_ERROR_BODY, CSRF_REJECTED);
    backend.expectOne(CSRF).flush(null);
    backend.expectOne(TICKETS).flush(CSRF_ERROR_BODY, CSRF_REJECTED);

    await expect(response).rejects.toMatchObject({ status: 403 });
    backend.expectNone(CSRF);
  });

  it('should not replay a 403 that is not about CSRF', async () => {
    const response = firstValueFrom(http.get(TICKETS));

    backend.expectOne(TICKETS).flush({ status: 403, error: 'Acesso negado' }, CSRF_REJECTED);

    await expect(response).rejects.toMatchObject({ status: 403 });
    backend.expectNone(CSRF);
  });
});
