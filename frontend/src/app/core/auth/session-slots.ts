import { Injectable, computed, signal } from '@angular/core';
import { User } from './auth.models';

/** Header that tells the API which of the browser's signed-in accounts a request belongs to. */
export const SESSION_SLOT_HEADER = 'X-Atendix-Session';
/** Same limit the API enforces (SessionSlot.MAX_SLOTS). */
export const MAX_SESSION_SLOTS = 5;
/** Query parameter that opens the login of a new tab on a free slot instead of the last account used. */
export const NEW_ACCOUNT_PARAM = 'nova-conta';

const DEFAULT_SLOT = 0;
const TAB_SLOT_KEY = 'atendix.session-slot';
const LAST_SLOT_KEY = 'atendix.last-session-slot';
const ACCOUNTS_KEY = 'atendix.accounts';

/** An account signed in on this browser, as listed in the account switcher. */
export interface SignedInAccount {
  slot: number;
  userId: string;
  name: string;
  login: string;
}

/**
 * Each tab works on one numbered slot, and each slot has its own session cookies in the API, so
 * different accounts can stay signed in side by side. The slot lives in sessionStorage (one per tab);
 * the list of signed-in accounts lives in localStorage so every tab can offer the switch.
 */
@Injectable({ providedIn: 'root' })
export class SessionSlots {
  private readonly _current = signal(this.initialSlot());
  private readonly _accounts = signal<SignedInAccount[]>(this.readAccounts());

  readonly current = this._current.asReadonly();
  readonly accounts = this._accounts.asReadonly();
  /** Accounts this tab can switch to. */
  readonly otherAccounts = computed(() => this._accounts().filter(account => account.slot !== this._current()));
  readonly canAddAccount = computed(() => this.freeSlot() !== null);

  constructor() {
    window.addEventListener('storage', event => {
      if (event.key === ACCOUNTS_KEY) {
        this._accounts.set(this.readAccounts());
      }
    });
  }

  /**
   * Moves this tab to a slot no account uses yet, for signing in with another account.
   * @returns false when every slot is taken
   */
  claimFreeSlot(): boolean {
    const slot = this.freeSlot();
    if (slot === null) {
      return false;
    }
    this.use(slot);
    return true;
  }

  /** Moves this tab to the slot of an account already signed in. */
  switchTo(slot: number): void {
    this.use(slot);
  }

  /** Records the account signed in on this tab's slot. */
  remember(user: User): void {
    const account: SignedInAccount = { slot: this._current(), userId: user.id, name: user.name, login: user.login };
    this.saveAccounts([...this._accounts().filter(existing => existing.slot !== account.slot), account]);
    localStorage.setItem(LAST_SLOT_KEY, String(account.slot));
  }

  /** Drops the account of this tab's slot from the list, after a logout or an expired session. */
  forgetCurrent(): void {
    this.saveAccounts(this._accounts().filter(account => account.slot !== this._current()));
  }

  private use(slot: number): void {
    sessionStorage.setItem(TAB_SLOT_KEY, String(slot));
    this._current.set(slot);
  }

  private freeSlot(): number | null {
    const taken = new Set(this._accounts().map(account => account.slot));
    for (let slot = DEFAULT_SLOT; slot < MAX_SESSION_SLOTS; slot++) {
      if (!taken.has(slot)) {
        return slot;
      }
    }
    return null;
  }

  // A duplicated tab keeps its slot; a brand-new tab continues on the account used last
  private initialSlot(): number {
    const slot = parseSlot(sessionStorage.getItem(TAB_SLOT_KEY)) ?? parseSlot(localStorage.getItem(LAST_SLOT_KEY))
      ?? DEFAULT_SLOT;
    sessionStorage.setItem(TAB_SLOT_KEY, String(slot));
    return slot;
  }

  private readAccounts(): SignedInAccount[] {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) {
      return [];
    }
    const accounts = JSON.parse(stored) as SignedInAccount[];
    return accounts.filter(account => parseSlot(String(account.slot)) !== null);
  }

  private saveAccounts(accounts: SignedInAccount[]): void {
    const sorted = [...accounts].sort((first, second) => first.slot - second.slot);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(sorted));
    this._accounts.set(sorted);
  }
}

function parseSlot(value: string | null): number | null {
  if (value === null || !/^\d$/.test(value)) {
    return null;
  }
  const slot = Number(value);
  return slot < MAX_SESSION_SLOTS ? slot : null;
}
