import * as React from 'react';

export interface StatusPillProps {
  children: React.ReactNode;
  /** danger = Aberto / SLA estourando, attention = Pendente, positive = Resolvido, info = Novo, neutral = Fechado. */
  tone?: 'danger' | 'attention' | 'positive' | 'info' | 'neutral';
  /** Leading 6px status dot. */
  dot?: boolean;
  /** Leading Lucide icon (e.g. "clock" for SLA). */
  icon?: string;
  /** No background — dot + dark label, for use inside selects/rows. */
  plain?: boolean;
  style?: React.CSSProperties;
}
/** Maps ticket status keys to tones. */
export declare const STATUS_TONE: Record<'open' | 'pending' | 'solved' | 'closed' | 'new', StatusPillProps['tone']>;
export declare function StatusPill(props: StatusPillProps): JSX.Element;
