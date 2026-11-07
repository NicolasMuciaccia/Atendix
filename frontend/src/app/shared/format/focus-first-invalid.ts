const INVALID_CONTROL = '[aria-invalid="true"]';

/**
 * After a rejected submit, moves the focus to the first field flagged as invalid. Deferred to the
 * next task so the `aria-invalid` bindings reflect the touched state first.
 */
export function focusFirstInvalid(container: HTMLElement): void {
  setTimeout(() => container.querySelector<HTMLElement>(INVALID_CONTROL)?.focus());
}
