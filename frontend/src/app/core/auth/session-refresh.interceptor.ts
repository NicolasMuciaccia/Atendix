import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { User } from './auth.models';
import { AUTH_URL, AuthService } from './auth.service';
import { AuthStore } from './auth.store';

const UNAUTHORIZED = 401;

// Endpoints that answer 401 for a reason a refresh cannot fix
const SESSION_ENDPOINTS = ['/login', '/refresh', '/logout', '/csrf'].map(path => `${AUTH_URL}${path}`);

// Shared so that several requests failing together trigger a single refresh
let refreshInFlight: Observable<User> | null = null;

/**
 * When the access token expires, renews the session once with the refresh token and replays the
 * request. If the renewal fails too, the session is over.
 */
export const sessionRefreshInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!isExpiredSession(error, request)) {
        return throwError(() => error);
      }
      return renewSession(authService, authStore).pipe(switchMap(() => next(request)));
    }),
  );
};

function isExpiredSession(error: unknown, request: HttpRequest<unknown>): boolean {
  return error instanceof HttpErrorResponse
    && error.status === UNAUTHORIZED
    && !SESSION_ENDPOINTS.includes(request.url);
}

function renewSession(authService: AuthService, authStore: AuthStore): Observable<User> {
  refreshInFlight ??= authService.refresh().pipe(
    tap(user => authStore.sessionRenewed(user)),
    catchError((refreshError: unknown) => {
      void authStore.sessionExpired();
      return throwError(() => refreshError);
    }),
    finalize(() => (refreshInFlight = null)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );
  return refreshInFlight;
}
