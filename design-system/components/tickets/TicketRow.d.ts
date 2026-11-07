import * as React from 'react';

/**
 * @startingPoint section="Tickets" subtitle="Inbox row — customer, subject, preview, priority + category" viewport="700x320"
 */
export interface TicketRowProps {
  name: string;
  avatarSrc?: string;
  subject: string;
  preview?: string;
  time: string;
  tags?: { label: string; tone?: 'high' | 'medium' | 'low' | 'neutral' | 'violet' | 'blue' }[];
  selected?: boolean;
  unread?: boolean;
  /** Mobile density: larger type, no preview line, md tags. */
  compact?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function TicketRow(props: TicketRowProps): JSX.Element;
