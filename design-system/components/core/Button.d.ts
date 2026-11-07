import * as React from 'react';

/**
 * @startingPoint section="Core" subtitle="Navy primary, blue accent, secondary, ghost, danger" viewport="700x260"
 */
export interface ButtonProps {
  /** primary = navy (main CTA: "Novo ticket", "Enviar"); accent = brand blue; secondary = white + border; ghost; danger = soft red. */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label (e.g. "arrow-right" on Enviar). */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
