/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { StoryDetail } from './pages/StoryDetail';
import { Reader } from './pages/Reader';
import { AdminStudio } from './pages/AdminStudio';
import { Search } from './pages/Search';
import { Library } from './pages/Library';
import { Donation } from './pages/Donation';
import { Legal } from './pages/Legal';
import { Settings } from './pages/Settings';
import { Github, MessageSquare, Shield, FileText } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased pb-20 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/story/:id" element={<StoryDetail />} />
                <Route path="/reader/:workId/:chapterId" element={<Reader />} />
                <Route path="/admin" element={<AdminStudio />} />
                <Route path="/search" element={<Search />} />
                <Route path="/comics-manhwas" element={<Search />} />
                <Route path="/terminados" element={<Search />} />
                <Route path="/biblioteca" element={<Library />} />
                <Route path="/donation" element={<Donation />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <BottomNav />
            <footer className="border-t border-slate-200 bg-white py-12 mb-16 md:mb-0 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                        M
                      </div>
                      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MANGAVERSE</span>
                    </div>
                    <p className="text-sm text-slate-500 text-center md:text-left dark:text-slate-400">
                      © 2026 MANGAVERSE. {t('home.heroSubtitle')}<br />
                      {t('home.startReading')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    <Link to="/legal#terminos" className="flex flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">{t('settings.legal')}</span>
                    </Link>
                    <Link to="/legal#privacidad" className="flex flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <Shield className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">{t('settings.support')}</span>
                    </Link>
                    <a href="https://wa.me/18293165263" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">{t('settings.sendFeedback')}</span>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <Github className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">GitHub</span>
                    </a>
                    <a href="https://x.com/RuicharD73393" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest">X</span>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
