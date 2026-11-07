import { HttpErrorResponse, HttpParams } from '@angular/common/http';

/** Same-origin base path: the dev server proxies /api to the back-end (proxy.conf.json). */
export const API_V1 = '/api/v1';

/** Error contract returned by every back-end endpoint (ApiErrorResponse). */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fields: Record<string, string> | null;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const UNREACHABLE_SERVER = 'Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.';
const UNEXPECTED_ERROR = 'Algo deu errado do nosso lado. Tente novamente em instantes.';
const SERVER_ERROR_STATUS = 500;
// Gateway answers: the dev proxy (or a reverse proxy) could not reach the back-end
const UNREACHABLE_STATUSES = [0, 502, 503, 504];

export function apiErrorOf(error: unknown): ApiError | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }
  const body = error.error as Partial<ApiError> | null;
  return body && typeof body.message === 'string' ? (body as ApiError) : null;
}

/** Message to show the user; the back-end already writes it in Portuguese and without internals. */
export function errorMessageOf(error: unknown): string {
  if (error instanceof HttpErrorResponse && UNREACHABLE_STATUSES.includes(error.status)) {
    return UNREACHABLE_SERVER;
  }
  if (error instanceof HttpErrorResponse && error.status >= SERVER_ERROR_STATUS) {
    return UNEXPECTED_ERROR;
  }
  return apiErrorOf(error)?.message ?? UNEXPECTED_ERROR;
}

export function fieldErrorsOf(error: unknown): Record<string, string> {
  return apiErrorOf(error)?.fields ?? {};
}

/** Builds query params skipping empty values, so optional filters are simply left out. */
export function queryParams(values: Record<string, string | number | null | undefined>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}
