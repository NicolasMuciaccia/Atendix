import { DestroyRef, Injectable, inject } from '@angular/core';

/** What one tab tells the others about the session of a slot they may share. */
export type SessionEvent =
  | { type: 'signed-in'; slot: number; userId: string }
  | { type: 'signed-out'; slot: number };

const CHANNEL_NAME = 'atendix-session';

/**
 * Tabs on the same slot share that slot's session cookies: signing in or out in one of them changes
 * the session of all of them. This channel lets those tabs follow instead of acting on a stale user;
 * tabs on other slots ignore the message.
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
