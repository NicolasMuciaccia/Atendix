import { Pipe, PipeTransform } from '@angular/core';

const LOCALE = 'pt-BR';
const SHORT_DATE = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: 'short' });
const LONG_DATE = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
const DATE_TIME = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

/**
 * Parses a calendar date ("2026-11-05") as local midnight. `new Date("2026-11-05")` would read it
 * as UTC and show the previous day in Brazil.
 */
export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

/** "Hoje", "Ontem" or "05 de nov." — the compact form used in lists. */
export function formatRelativeDate(isoDate: string, today: Date = new Date()): string {
  const date = parseLocalDate(isoDate);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysAgo = Math.round((startOfToday.getTime() - date.getTime()) / 86_400_000);
  if (daysAgo === 0) {
    return 'Hoje';
  }
  if (daysAgo === 1) {
    return 'Ontem';
  }
  return SHORT_DATE.format(date);
}

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(isoDate: string): string {
    return formatRelativeDate(isoDate);
  }
}

@Pipe({ name: 'longDate' })
export class LongDatePipe implements PipeTransform {
  transform(isoDate: string): string {
    return LONG_DATE.format(parseLocalDate(isoDate));
  }
}

/** Instants from the API (UTC) shown in the browser time zone. */
@Pipe({ name: 'dateTime' })
export class DateTimePipe implements PipeTransform {
  transform(instant: string): string {
    return DATE_TIME.format(new Date(instant)).replace(',', ' ·');
  }
}
