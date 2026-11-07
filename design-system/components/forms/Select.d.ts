import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  /** CSS color for a leading status dot. */
  dot?: string;
  icon?: string;
  avatar?: React.ReactNode;
}
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: SelectOption) => void;
  placeholder?: string;
  /** sm = 26px compact (ticket details), md = 34px (forms). */
  size?: 'sm' | 'md';
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
