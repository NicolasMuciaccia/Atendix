import * as React from 'react';

export interface SidebarItem {
  id: string;
  icon?: string;
  label: string;
  count?: number | string;
}
/**
 * @startingPoint section="Navigation" subtitle="Navy app rail with views, teams and agent" viewport="700x420"
 */
export interface SidebarProps {
  /** Wordmark text — plain type, no logo asset exists. */
  brand?: string;
  items: SidebarItem[];
  groups?: { title: string; items: SidebarItem[] }[];
  activeId?: string;
  onSelect?: (id: string) => void;
  user?: { name: string; src?: string; status?: 'online' | 'away' | 'busy' | 'offline'; statusLabel?: string };
  onSearch?: () => void;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
