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

const USER: User = {
  id: 'b1c2', name: 'Usuário Comum', login: 'usuario', role: 'COMMON',
  mustChangePassword: false, createdAt: '2026-11-07T12:00:00Z',
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

    backend.expectOne(TICKETS).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(REFRESH).flush(USER);
    backend.expectOne(TICKETS).flush({ content: [] });

    expect(await response).toEqual({ content: [] });
    expect(authStore.user()).toEqual(USER);
  });

  it('should refresh only once when several requests expire together', async () => {
    const first = firstValueFrom(http.get(TICKETS));
    const second = firstValueFrom(http.get(`${TICKETS}/a1`));

    backend.expectOne(TICKETS).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${TICKETS}/a1`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(REFRESH).flush(USER);
    backend.expectOne(TICKETS).flush({});
    backend.expectOne(`${TICKETS}/a1`).flush({});

    await Promise.all([first, second]);
  });

  it('should end the session when the refresh token is no longer valid', async () => {
    const response = firstValueFrom(http.get(TICKETS));

    backend.expectOne(TICKETS).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(REFRESH).flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(response).rejects.toMatchObject({ status: 401 });
    expect(authStore.status()).toBe('anonymous');
  });

  it('should not try to refresh when the login itself is rejected', async () => {
    const response = firstValueFrom(http.post(LOGIN, {}));

    backend.expectOne(LOGIN).flush(null, { status: 401, statusText: 'Unauthorized' });

    await expect(response).rejects.toMatchObject({ status: 401 });
    backend.expectNone(REFRESH);
  });
});
