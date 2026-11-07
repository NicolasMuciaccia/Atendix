import * as React from 'react';

export interface DetailRowProps {
  label: string;
  children: React.ReactNode;
  labelWidth?: number;
  style?: React.CSSProperties;
}
export declare function DetailRow(props: DetailRowProps): JSX.Element;
