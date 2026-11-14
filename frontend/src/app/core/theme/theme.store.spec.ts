import { TestBed } from '@angular/core/testing';
import { ThemeStore } from './theme.store';

describe('ThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    // jsdom has no matchMedia: the operating system is simulated as using the light theme
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  function create(): ThemeStore {
    const store = TestBed.inject(ThemeStore);
    TestBed.tick();
    return store;
  }

  it('should follow the operating system until the user chooses', () => {
    const store = create();

    expect(store.preference()).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('should apply and remember the theme the user switches to', () => {
    const store = create();
    const opposite = store.theme() === 'dark' ? 'light' : 'dark';

    store.toggle();
    TestBed.tick();

    expect(store.theme()).toBe(opposite);
    expect(document.documentElement.getAttribute('data-theme')).toBe(opposite);
    expect(localStorage.getItem('atendix.theme')).toBe(opposite);
  });

  it('should start with the theme saved in a previous visit', () => {
    localStorage.setItem('atendix.theme', 'dark');

    expect(create().theme()).toBe('dark');
  });
});
