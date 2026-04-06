/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Clock, Trash2 } from 'lucide-react';
import { Badge, Button, Skeleton, Card, CardContent } from '@/src/components/ui';
import { getLibrary, getStoryById } from '@/src/services/workService';
import { Story, UserLibraryItem } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/src/utils';

export function Library() {
  const { user, loading: authLoading } = useAuth();
  const [libraryItems, setLibraryItems] = useState<UserLibraryItem[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      return;
    }

    const fetchLibrary = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const items = await getLibrary(user.uid);
        if (items) {
          setLibraryItems(items);
          const storyPromises = items.map(item => getStoryById(item.story_id));
          const storyData = await Promise.all(storyPromises);
          setStories(storyData.filter((s): s is Story => s !== null));
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Mi Biblioteca</h1>
          <p className="text-slate-500">Tus historias favoritas guardadas</p>
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <BookOpen className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Tu biblioteca está vacía</h2>
          <p className="mt-2 text-slate-500">Explora el catálogo y añade historias a tu biblioteca.</p>
          <Link to="/stories" className="mt-6">
            <Button>Explorar Catálogo</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {stories.map((story) => (
            <div key={story.id} className="group relative">
              <Link to={`/story/${story.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1">
                  <img
                    src={story.cover_url}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-2 top-2">
                    <Badge variant={story.status === 'FINALIZADO' ? 'success' : 'warning'}>
                      {story.status === 'FINALIZADO' ? 'FINALIZADO' : 'EN EMISIÓN'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                    {story.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Añadido recientemente</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
