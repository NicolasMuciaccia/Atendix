import * as React from 'react';

export interface CustomerSummaryProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  /** Icon + text lines: location, customer since, plan… */
  details?: { icon: string; label: string }[];
  profileLabel?: string;
  onViewProfile?: () => void;
  onMore?: () => void;
  style?: React.CSSProperties;
}
export declare function CustomerSummary(props: CustomerSummaryProps): JSX.Element;
