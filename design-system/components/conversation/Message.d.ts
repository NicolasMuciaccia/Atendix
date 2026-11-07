import * as React from 'react';

export interface MessageProps {
  author: string;
  avatarSrc?: string;
  time?: string;
  /** customer = gray bubble, agent = blue-tinted, note = amber internal note. */
  role?: 'customer' | 'agent' | 'note';
  noteLabel?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Message(props: MessageProps): JSX.Element;
