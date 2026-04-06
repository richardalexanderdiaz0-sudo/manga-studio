/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useState } from 'react';
import { cn } from '@/src/utils';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  activeValue?: string;
  onSelect?: (value: string) => void;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
  activeValue?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={cn('w-full', className)}>
      {Array.isArray(children)
        ? children.map((child) => {
            if (!child) return null;
            return {
              ...child,
              props: {
                ...child.props,
                activeValue: activeTab,
                onSelect: setActiveTab,
              },
            };
          })
        : children}
    </div>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn('inline-flex h-10 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className, activeValue, onSelect }: TabsTriggerProps) {
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => onSelect?.(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive ? 'bg-white text-slate-950 shadow-sm' : 'hover:bg-white/50 hover:text-slate-950',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, activeValue }: TabsContentProps) {
  if (activeValue !== value) return null;
  return <div className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2', className)}>{children}</div>;
}
