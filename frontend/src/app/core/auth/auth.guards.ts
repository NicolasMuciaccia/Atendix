import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FIRST_ACCESS_PATH, HOME_PATH, LOGIN_PATH } from './auth.paths';
import { AuthStore } from './auth.store';

/** Only signed-in users who already replaced the initial password. */
export const workspaceGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return router.parseUrl(LOGIN_PATH);
  }
  if (authStore.mustChangePassword()) {
    return router.parseUrl(FIRST_ACCESS_PATH);
  }
  return true;
};

/** The first-access screen: signed in, initial password still pending. */
export const firstAccessGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return router.parseUrl(LOGIN_PATH);
  }
  return authStore.mustChangePassword() ? true : router.parseUrl(HOME_PATH);
};

/** The login screen only makes sense without a session. */
export const guestGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  return authStore.isAuthenticated() ? inject(Router).parseUrl(HOME_PATH) : true;
};

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  return authStore.isAdmin() ? true : inject(Router).parseUrl(HOME_PATH);
};
