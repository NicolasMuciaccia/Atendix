import * as React from 'react';

export interface RelatedTicketProps {
  title: string;
  /** Ticket number, e.g. "#AX-40211". */
  id: string;
  date: string;
  status?: string;
  tone?: 'danger' | 'attention' | 'positive' | 'info' | 'neutral';
  icon?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function RelatedTicket(props: RelatedTicketProps): JSX.Element;
