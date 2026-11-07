import * as React from 'react';

export interface CardProps {
  /** default = white + hairline border; subtle = blue-50 fill; muted = gray-50; inverse = navy. */
  tone?: 'default' | 'subtle' | 'muted' | 'inverse';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;
  radius?: 'md' | 'lg' | 'xl' | '2xl';
  elevation?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  /** Lifts 1px + shadow-md on hover. */
  interactive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
