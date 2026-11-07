import * as React from 'react';

export interface TagProps {
  children: React.ReactNode;
  /** Priority: high / medium / low. Category: neutral / violet / blue. */
  tone?: 'high' | 'medium' | 'low' | 'neutral' | 'violet' | 'blue';
  /** sm = 20px (desktop lists), md = 24px (mobile). */
  size?: 'sm' | 'md';
  icon?: string;
  /** Makes the tag a button (e.g. "+ Adicionar tag"). */
  onClick?: () => void;
  /** Shows a remove (x) affordance. */
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
