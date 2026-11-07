import * as React from 'react';

export interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  /** Leading Lucide icon, e.g. "search". */
  icon?: string;
  /** Trailing node (kbd hint, clear button). */
  trailing?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
