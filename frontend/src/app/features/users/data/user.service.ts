import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_V1, Page, queryParams } from '../../../core/api/api';
import { Role, User } from '../../../core/auth/auth.models';

const USERS_URL = `${API_V1}/users`;
export const USERS_PAGE_SIZE = 50;

export interface CreateUserRequest {
  name: string;
  login: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  list(page: number): Observable<Page<User>> {
    return this.http.get<Page<User>>(USERS_URL, { params: queryParams({ page, size: USERS_PAGE_SIZE }) });
  }

  create(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(USERS_URL, request);
  }

  changeRole(userId: string, role: Role): Observable<User> {
    return this.http.patch<User>(`${USERS_URL}/${userId}/role`, { role });
  }

  changeActive(userId: string, active: boolean): Observable<User> {
    return this.http.patch<User>(`${USERS_URL}/${userId}/active`, { active });
  }

  resetPassword(userId: string): Observable<void> {
    return this.http.post<void>(`${USERS_URL}/${userId}/password-reset`, null);
  }
}
