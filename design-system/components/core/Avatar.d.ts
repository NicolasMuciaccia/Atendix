import * as React from 'react';

export interface AvatarProps {
  /** Full name — used for initials, color and alt text. */
  name: string;
  /** Photo URL. Without it, tinted initials render. */
  src?: string;
  /** 24 · 32 (messages) · 36 (ticket rows) · 42 (customer panel). */
  size?: number;
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Ring around the status dot — match the surface behind (navy in sidebar). */
  ringColor?: string;
  /** Force a tint index 0–4 instead of the name hash. */
  tone?: number;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
