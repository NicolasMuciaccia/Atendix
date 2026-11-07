import * as React from 'react';

export interface TextLinkProps {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  /** Trailing arrow that nudges on hover ("Ver perfil completo →"). */
  arrow?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function TextLink(props: TextLinkProps): JSX.Element;
