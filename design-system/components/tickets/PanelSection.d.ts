import * as React from 'react';

export interface PanelSectionProps {
  title?: string;
  count?: number | string;
  action?: React.ReactNode;
  /** Hairline divider below the section. */
  divider?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PanelSection(props: PanelSectionProps): JSX.Element;
