import * as React from 'react';

/**
 * @startingPoint section="Tickets" subtitle="KPI card with icon tile, delta and sparkline" viewport="700x200"
 */
export interface KpiCardProps {
  icon?: string;
  tone?: 'blue' | 'amber' | 'green' | 'violet';
  label: string;
  value: React.ReactNode;
  /** Delta text, e.g. "24%" or "3". */
  delta?: string;
  direction?: 'up' | 'down';
  /** Whether the change is good (green) or bad (red) — independent of direction. */
  sentiment?: 'positive' | 'negative';
  chart?: 'line' | 'bars';
  data?: number[];
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function KpiCard(props: KpiCardProps): JSX.Element;
