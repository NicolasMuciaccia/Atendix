import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_V1 } from '../api/api';
import { ChangePasswordRequest, LoginRequest, User } from './auth.models';

export const AUTH_URL = `${API_V1}/auth`;
const CURRENT_USER_URL = `${API_V1}/users/me`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Makes the back-end write the XSRF-TOKEN cookie that Angular echoes in X-XSRF-TOKEN. */
  issueCsrfToken(): Observable<void> {
    return this.http.get<void>(`${AUTH_URL}/csrf`);
  }

  login(request: LoginRequest): Observable<User> {
    return this.http.post<User>(`${AUTH_URL}/login`, request);
  }

  refresh(): Observable<User> {
    return this.http.post<User>(`${AUTH_URL}/refresh`, null);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${AUTH_URL}/logout`, null);
  }

  changePassword(request: ChangePasswordRequest): Observable<User> {
    return this.http.put<User>(`${AUTH_URL}/password`, request);
  }

  currentUser(): Observable<User> {
    return this.http.get<User>(CURRENT_USER_URL);
  }
}
