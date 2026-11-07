import * as React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  /** neutral (counts), accent (active tab), solid (mobile unread), nav / navActive (sidebar), danger. */
  tone?: 'neutral' | 'accent' | 'solid' | 'nav' | 'navActive' | 'danger';
  size?: 'sm' | 'md';
  /** Ring color when overlapping an icon (e.g. "var(--white)"). */
  ring?: string;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
