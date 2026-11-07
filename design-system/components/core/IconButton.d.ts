import * as React from 'react';

export interface IconButtonProps {
  icon: string;
  /** Required accessible label (also used as tooltip). */
  label: string;
  /** ghost (toolbar), outline (••• menus, filter), solid (navy), inverse (on navy sidebar). */
  variant?: 'ghost' | 'outline' | 'solid' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  round?: boolean;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
