export type Role = 'COMMON' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  login: string;
  role: Role;
  mustChangePassword: boolean;
  /** False when an administrator deactivated the account. */
  active: boolean;
  createdAt: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  COMMON: 'Usuário comum',
  ADMIN: 'Administrador',
};

/** Password every account starts with (assignment rule); it must be replaced on first access. */
export const INITIAL_PASSWORD = 'mudar@123';
