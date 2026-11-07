import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const TONES = [
  { bg: 'var(--blue-100)', fg: 'var(--blue-700)' },
  { bg: 'var(--violet-100)', fg: 'var(--violet-600)' },
  { bg: 'var(--green-100)', fg: 'var(--green-600)' },
  { bg: 'var(--amber-100)', fg: 'var(--amber-600)' },
  { bg: 'var(--ink-150)', fg: 'var(--ink-700)' },
];
const HASH_MULTIPLIER = 31;
const INITIALS_SCALE = 0.36;

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// Same name, same color: the tone is derived from the name instead of being random
function toneOf(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * HASH_MULTIPLIER + char.charCodeAt(0)) | 0;
  }
  return TONES[Math.abs(hash) % TONES.length];
}

/** Initials avatar; the product has no profile photos. */
@Component({
  selector: 'atx-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-size.px]': 'fontSize()',
    '[style.background]': 'tone().bg',
    '[style.color]': 'tone().fg',
  },
  template: `{{ initials() }}`,
  styles: `
    :host {
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      border-radius: 50%; font-weight: var(--weight-semibold); letter-spacing: .01em; line-height: 1;
    }
  `,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly size = input(36);

  protected readonly initials = computed(() => initialsOf(this.name()));
  protected readonly tone = computed(() => toneOf(this.name()));
  protected readonly fontSize = computed(() => Math.round(this.size() * INITIALS_SCALE));
}
