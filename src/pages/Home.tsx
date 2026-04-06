/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Clock, TrendingUp, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { Badge, Button, Skeleton } from '@/src/components/ui';
import { getStories } from '@/src/services/workService';
import { Story } from '@/src/types';
import { cn } from '@/src/utils';

export function Home() {
  const { t } = useTranslation();
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [comingSoonStories, setComingSoonStories] = useState<Story[]>([]);
  const [trendingStories, setTrendingStories] = useState<Story[]>([]);
  const [finishedStories, setFinishedStories] = useState<Story[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [recent, soon, trending, finished, all] = await Promise.all([
          getStories({ limit: 6 }),
          getStories({ status: 'PROXIMAMENTE', limit: 6 }),
          getStories({ limit: 6 }), // In a real app, this would be based on views/likes
          getStories({ status: 'FINALIZADO', limit: 6 }),
          getStories({ limit: 12 }),
        ]);

        setRecentStories(recent || []);
        setComingSoonStories(soon || []);
        setTrendingStories(trending || []);
        setFinishedStories(finished || []);
        setAllStories(all || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const Section = ({ title, icon: Icon, stories, linkTo, showBadge = false }: { title: string, icon: any, stories: Story[], linkTo?: string, showBadge?: boolean }) => (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
        </div>
        {linkTo && (
          <Link to={linkTo}>
            <Button variant="ghost" size="sm" className="gap-1">
              {t('home.viewAll')} <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : stories.map((story) => (
              <Link key={story.id} to={`/story/${story.id}`} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1 dark:bg-slate-800">
                  <img
                    src={story.cover_url}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  {showBadge && (
                    <div className="absolute left-2 top-2">
                      {story.status === 'completed' ? (
                        <Badge variant="success">{t('home.finished')}</Badge>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{story.category}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section / Featured */}
      <section className="mb-16">
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-slate-900 sm:h-[500px]">
          <img
            src="https://picsum.photos/seed/manga-hero/1920/1080"
            alt="Featured"
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-8 sm:p-12">
            <Badge variant="default" className="mb-4 w-fit">{t('home.featured')}</Badge>
            <h1 className="mb-4 max-w-2xl text-4xl font-black text-white sm:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mb-8 max-w-xl text-lg text-slate-300">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex gap-4">
              <Button size="lg">{t('home.startReading')}</Button>
              <Button variant="secondary" size="lg">{t('home.viewCatalog')}</Button>
            </div>
          </div>
        </div>
      </section>

      <Section title={t('home.recent')} icon={Clock} stories={recentStories} />
      <Section title={t('home.comingSoon')} icon={Calendar} stories={comingSoonStories} />
      <Section title={t('home.dailyUpdates')} icon={TrendingUp} stories={trendingStories} />
      <Section title={t('home.trending')} icon={TrendingUp} stories={trendingStories} />
      
      <Section 
        title={t('nav.comics')} 
        icon={BookOpen} 
        stories={allStories} 
        linkTo="/stories" 
        showBadge={true}
      />

      <Section 
        title={t('nav.finished')} 
        icon={CheckCircle2} 
        stories={finishedStories} 
        linkTo="/terminados" 
        showBadge={true}
      />

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">{t('nav.finished')}</h2>
        </div>
        {finishedStories.length === 0 && !loading ? (
          <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {t('home.noFinished')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
                ))
              : finishedStories.map((work) => (
                  <Link key={work.id} to={`/work/${work.id}`} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={work.coverUrl}
                        alt={work.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute left-2 top-2">
                        <Badge variant="success">{t('home.finished')}</Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-slate-100">{work.title}</h3>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </section>
    </div>
  );
}
