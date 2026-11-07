import * as React from 'react';

export interface IconProps {
  /** Lucide icon name (kebab-case). Available: see Icon.names / assets/icons/. */
  name: string;
  /** Pixel size. 14 inline, 16 default UI, 20 KPI tiles, 22 mobile nav. */
  size?: number;
  /** Default 1.75 — the reference uses thin, rounded strokes. */
  strokeWidth?: number;
  color?: string;
  /** Accessible title; omit for decorative icons. */
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}
export declare function Icon(props: IconProps): JSX.Element | null;
