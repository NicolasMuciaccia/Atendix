import { LongDatePipe, formatRelativeDate, parseLocalDate, toIsoDate } from './dates';

const TODAY = new Date(2026, 10, 7, 15, 30);

describe('dates', () => {
  it('should read a calendar date as local midnight instead of UTC', () => {
    const date = parseLocalDate('2026-11-05');

    expect(date.getDate()).toBe(5);
    expect(date.getHours()).toBe(0);
  });

  it('should round-trip a local date to the API format', () => {
    expect(toIsoDate(parseLocalDate('2026-01-09'))).toBe('2026-01-09');
  });

  it('should describe today and yesterday in words', () => {
    expect(formatRelativeDate('2026-11-07', TODAY)).toBe('Hoje');
    expect(formatRelativeDate('2026-11-06', TODAY)).toBe('Ontem');
  });

  it('should show older dates with day and month', () => {
    expect(formatRelativeDate('2026-10-20', TODAY)).toMatch(/^20 de out/);
  });

  it('should show the full date in the Brazilian format', () => {
    expect(new LongDatePipe().transform('2026-11-05')).toBe('05/11/2026');
  });
});
