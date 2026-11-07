import * as React from 'react';

/**
 * @startingPoint section="Conversation" subtitle="Reply / internal-note composer" viewport="700x220"
 */
export interface ComposerProps {
  mode?: 'reply' | 'note';
  defaultMode?: 'reply' | 'note';
  onModeChange?: (mode: 'reply' | 'note') => void;
  value?: string;
  onChange?: (text: string) => void;
  /** Called with text + mode. Cmd/Ctrl+Enter also sends. */
  onSend?: (text: string, mode: 'reply' | 'note') => void;
  replyLabel?: string;
  noteLabel?: string;
  placeholder?: string;
  notePlaceholder?: string;
  sendLabel?: string;
  internalLabel?: string;
  /** Toolbar Lucide icons. */
  tools?: string[];
  style?: React.CSSProperties;
}
export declare function Composer(props: ComposerProps): JSX.Element;
