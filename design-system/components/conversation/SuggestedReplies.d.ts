import * as React from 'react';

export interface SuggestedRepliesProps {
  label?: string;
  items: string[];
  onPick?: (text: string) => void;
  style?: React.CSSProperties;
}
export declare function SuggestedReplies(props: SuggestedRepliesProps): JSX.Element;
