import * as React from 'react';

export interface NavItemProps {
  icon?: string;
  label: string;
  count?: number | string;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
/** Sidebar row on the navy rail. */
export declare function NavItem(props: NavItemProps): JSX.Element;
