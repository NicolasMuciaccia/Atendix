import * as React from 'react';

export interface BottomNavItem {
  id: string;
  icon: string;
  label: string;
  badge?: number | string;
}
export interface BottomNavProps {
  /** 4 items recommended — split evenly around the central action. */
  items: BottomNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Central navy FAB. Omit to hide. */
  onAction?: () => void;
  actionIcon?: string;
  actionLabel?: string;
  style?: React.CSSProperties;
}
export declare function BottomNav(props: BottomNavProps): JSX.Element;
