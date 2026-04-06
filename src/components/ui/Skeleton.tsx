/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HTMLAttributes } from 'react';
import { cn } from '@/src/utils';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-100', className)}
      {...props}
    />
  );
}

export { Skeleton };
