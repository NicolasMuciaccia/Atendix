import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_V1 } from '../api/api';
import { SESSION_SLOT_HEADER, SessionSlots } from './session-slots';

/** Tells the API which signed-in account of the browser this tab is working with. */
export const sessionSlotInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_V1)) {
    return next(request);
  }
  const slot = inject(SessionSlots).current();
  return next(request.clone({ setHeaders: { [SESSION_SLOT_HEADER]: String(slot) } }));
};
