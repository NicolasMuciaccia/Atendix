import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, computed, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

// Read by the inline script in index.html, which applies the choice before the first paint
const STORAGE_KEY = 'atendix.theme';
const THEME_ATTRIBUTE = 'data-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
// Browser chrome color (address bar on mobile), matching the navigation background of each theme
const THEME_COLORS: Record<Theme, string> = { light: '#101F3C', dark: '#0A0D0E' };

/** Light or dark appearance. Without an explicit choice the app follows the operating system. */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly document = inject(DOCUMENT);
  private readonly systemQuery = this.document.defaultView!.matchMedia(DARK_QUERY);

  private readonly _preference = signal<ThemePreference>(readPreference());
  private readonly systemTheme = signal<Theme>(this.systemQuery.matches ? 'dark' : 'light');

  readonly preference = this._preference.asReadonly();
  readonly theme = computed<Theme>(() => {
    const preference = this._preference();
    return preference === 'system' ? this.systemTheme() : preference;
  });

  constructor() {
    const followSystem = (event: MediaQueryListEvent) => this.systemTheme.set(event.matches ? 'dark' : 'light');
    this.systemQuery.addEventListener('change', followSystem);
    // A choice made in another tab applies here too
    const followOtherTab = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        this._preference.set(readPreference());
      }
    };
    const window = this.document.defaultView!;
    window.addEventListener('storage', followOtherTab);
    inject(DestroyRef).onDestroy(() => {
      this.systemQuery.removeEventListener('change', followSystem);
      window.removeEventListener('storage', followOtherTab);
    });

    effect(() => this.apply(this._preference(), this.theme()));
  }

  setPreference(preference: ThemePreference): void {
    if (preference === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, preference);
    }
    this._preference.set(preference);
  }

  /** Switches to the opposite of what is on screen, which becomes an explicit choice. */
  toggle(): void {
    this.setPreference(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private apply(preference: ThemePreference, theme: Theme): void {
    const root = this.document.documentElement;
    if (preference === 'system') {
      root.removeAttribute(THEME_ATTRIBUTE);
    } else {
      root.setAttribute(THEME_ATTRIBUTE, preference);
    }
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  }
}

function readPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}
