import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { ApiError } from '../api/api';
import { User } from './auth.models';
import { AUTH_URL, AuthService } from './auth.service';
import { AuthStore } from './auth.store';

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const XSRF_HEADER = 'X-XSRF-TOKEN';
// "error" the API sends when the CSRF token is missing or stale (ApiAccessDeniedHandler.CSRF_ERROR)
const CSRF_ERROR = 'Token CSRF inválido';

// Endpoints that answer 401 for a reason a refresh cannot fix
const SESSION_ENDPOINTS = ['/login', '/refresh', '/logout', '/csrf'].map(path => `${AUTH_URL}${path}`);

// Marks a request already replayed after a CSRF rejection, so it is never retried twice
const CSRF_RETRIED = new HttpContextToken<boolean>(() => false);

// Shared so that several requests failing together trigger a single refresh
let refreshInFlight: Observable<User> | null = null;

/**
 * Recovers from the two ways a valid user can be rejected:
 * - CSRF token missing or stale: fetches a new one and replays the request once (the API rejects
 *   before doing anything, so replaying is safe);
 * - access token expired: renews the session once with the refresh token and replays the request.
 */
export const sessionRefreshInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const xsrfTokens = inject(HttpXsrfTokenExtractor);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (isCsrfRejection(error) && !request.context.get(CSRF_RETRIED)) {
        return authService.issueCsrfToken().pipe(
          switchMap(() => next(withFreshCsrfToken(request, xsrfTokens.getToken()))),
        );
      }
      if (isExpiredSession(error, request)) {
        return recoverExpiredSession(request, next, authService, authStore);
      }
      return throwError(() => error);
    }),
  );
};

function recoverExpiredSession(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService,
                               authStore: AuthStore): Observable<HttpEvent<unknown>> {
  return renewSession(authService, authStore).pipe(
    switchMap(() => next(request)),
    catchError((error: unknown) => {
      if (!isUnauthorized(error)) {
        return throwError(() => error);
      }
      // Another tab may have used the same refresh token a moment earlier; its new cookies are
      // already in the browser, so the request gets one more chance before the session is dropped
      return next(request).pipe(
        catchError((retryError: unknown) => {
          if (isUnauthorized(retryError)) {
            void authStore.sessionExpired();
          }
          return throwError(() => retryError);
        }),
      );
    }),
  );
}

function renewSession(authService: AuthService, authStore: AuthStore): Observable<User> {
  refreshInFlight ??= authService.refresh().pipe(
    tap(user => authStore.sessionRenewed(user)),
    finalize(() => (refreshInFlight = null)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );
  return refreshInFlight;
}

function withFreshCsrfToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  return request.clone({
    context: request.context.set(CSRF_RETRIED, true),
    setHeaders: token ? { [XSRF_HEADER]: token } : {},
  });
}

function isCsrfRejection(error: unknown): boolean {
  return error instanceof HttpErrorResponse
    && error.status === FORBIDDEN
    && (error.error as Partial<ApiError> | null)?.error === CSRF_ERROR;
}

function isExpiredSession(error: unknown, request: HttpRequest<unknown>): boolean {
  return isUnauthorized(error) && !SESSION_ENDPOINTS.includes(request.url);
}

function isUnauthorized(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === UNAUTHORIZED;
}
