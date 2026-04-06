/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, LayoutDashboard, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useAuth } from '@/src/contexts/AuthContext';
import { ADMIN_EMAIL } from '@/src/constants';
import { cn } from '@/src/utils';

export function BottomNav() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const navItems = [
    { label: t('nav.home'), icon: Home, path: '/' },
    { label: t('nav.discover'), icon: Search, path: '/search' },
    { label: t('nav.donation'), icon: Heart, path: '/donation' },
    { label: t('nav.library'), icon: Heart, path: '/biblioteca', protected: true },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', icon: LayoutDashboard, path: '/admin' });
  }
  
  navItems.push({ label: t('nav.settings'), icon: User, path: '/settings' });

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white/95 pb-safe backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.protected && !user) return null;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-all duration-200 px-4 py-1 rounded-xl",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-300"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                isActive && "bg-indigo-50 dark:bg-indigo-900/20"
              )}>
                <Icon className={cn("h-5 w-5", isActive && "fill-indigo-600/10")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 h-1 w-8 rounded-full bg-indigo-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
