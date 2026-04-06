/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  children?: ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700',
      secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
      outline: 'text-slate-950 border border-slate-200',
      destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
      success: 'border-transparent bg-emerald-600 text-white hover:bg-emerald-700',
      warning: 'border-transparent bg-amber-600 text-white hover:bg-amber-700',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
