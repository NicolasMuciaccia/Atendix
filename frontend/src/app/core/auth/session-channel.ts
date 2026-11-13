import { DestroyRef, Injectable, inject } from '@angular/core';

/** What one tab tells the others about the session they all share through the cookies. */
export type SessionEvent =
  | { type: 'signed-in'; userId: string }
  | { type: 'signed-out' };

const CHANNEL_NAME = 'atendix-session';

/**
 * Cookies are shared by every tab of the browser: signing in or out in one tab changes the session
 * of all of them. This channel lets the other tabs follow instead of acting on a stale user.
 */
@Injectable({ providedIn: 'root' })
export class SessionChannel {
  // Browsers without BroadcastChannel keep working; their tabs just do not follow each other
  private readonly channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.channel?.close());
  }

  publish(event: SessionEvent): void {
    this.channel?.postMessage(event);
  }

  listen(handler: (event: SessionEvent) => void): void {
    this.channel?.addEventListener('message', message => handler(message.data as SessionEvent));
  }
}
