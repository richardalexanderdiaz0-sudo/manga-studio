/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, LayoutDashboard, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button, Input } from './ui';
import { useAuth } from '@/src/contexts/AuthContext';
import { ADMIN_EMAIL } from '@/src/constants';
import { NotificationBell } from './NotificationBell';
import { AuthModal } from './AuthModal';
import { InstallButton } from './InstallButton';

export function Navbar() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MANGAVERSE</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <Link to="/comics-manhwas" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              {t('nav.comics')}
            </Link>
            <Link to="/terminados" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              {t('nav.finished')}
            </Link>
            {user && (
              <Link to="/biblioteca" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                {t('nav.library')}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:relative lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder={t('nav.search')}
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="hidden md:flex md:items-center md:gap-2">
            <InstallButton />
            {user ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" title="Panel de Admin">
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={signOut} title={t('nav.logout')}>
                  <LogOut className="h-5 w-5" />
                </Button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="h-full w-full rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>{t('nav.login')}</Button>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <InstallButton />
            <NotificationBell />
            <form onSubmit={handleSearch} className="flex-1 ml-4">
              <Input
                type="search"
                placeholder={t('nav.search')}
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/comics-manhwas" className="text-lg font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>
              {t('nav.comics')}
            </Link>
            <Link to="/terminados" className="text-lg font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>
              {t('nav.finished')}
            </Link>
            {user && (
              <Link to="/biblioteca" className="text-lg font-medium dark:text-white" onClick={() => setIsMenuOpen(false)}>
                {t('nav.library')}
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-lg font-medium text-indigo-600" onClick={() => setIsMenuOpen(false)}>
                Panel de Admin
              </Link>
            )}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {user ? (
                <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                  {t('nav.logout')}
                </Button>
              ) : (
                <Button className="w-full" onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}>
                  {t('nav.login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
