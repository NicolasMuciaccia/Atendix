import * as React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** underline (desktop inbox filters, composer) or pill (mobile segmented). */
  variant?: 'underline' | 'pill';
  size?: 'sm' | 'md';
  /** Right-aligned node (e.g. ••• IconButton). */
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
