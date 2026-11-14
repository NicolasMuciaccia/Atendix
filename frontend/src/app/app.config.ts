import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { AuthStore } from './core/auth/auth.store';
import { sessionRefreshInterceptor } from './core/auth/session-refresh.interceptor';
import { sessionSlotInterceptor } from './core/auth/session-slot.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // XSRF protection is on by default: Angular echoes the XSRF-TOKEN cookie in X-XSRF-TOKEN
    // The slot header goes first, so requests replayed by the refresh interceptor keep it
    provideHttpClient(withInterceptors([sessionSlotInterceptor, sessionRefreshInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => inject(AuthStore).start(new URL(window.location.href))),
  ],
};
