/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import { Badge, Button, Input, Skeleton, Card, CardContent } from '@/src/components/ui';
import { getStories } from '@/src/services/workService';
import { Story } from '@/src/types';
import { CATEGORIES } from '@/src/constants';
import { cn } from '@/src/utils';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const allStories = await getStories();
        if (allStories) {
          let filtered = allStories;
          
          if (query) {
            filtered = filtered.filter(s => 
              s.title.toLowerCase().includes(query.toLowerCase()) ||
              s.description.toLowerCase().includes(query.toLowerCase())
            );
          }
          
          if (selectedCategory) {
            filtered = filtered.filter(s => s.category === selectedCategory);
          }
          
          setStories(filtered);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [query, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <SearchIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {query ? `Resultados para "${query}"` : 'Explorar Catálogo'}
            </h1>
            <p className="text-slate-500">Encuentra tu próxima lectura favorita</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="gap-2 md:w-auto"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      {isFilterOpen && (
        <Card className="mb-8 border-indigo-100 bg-indigo-50/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                  <Filter className="h-4 w-4" /> Categorías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                        selectedCategory === cat ? "bg-indigo-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory(null); }}>
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <BookOpen className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">No se encontraron resultados</h2>
          <p className="mt-2 text-slate-500">Intenta con otros términos o filtros.</p>
          <Button variant="outline" className="mt-6" onClick={() => { setSearchParams({}); setSelectedCategory(null); }}>
            Ver todo el catálogo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {stories.map((story) => (
            <Link key={story.id} to={`/story/${story.id}`} className="group">
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
                  <span>{story.category}</span>
                  <span>•</span>
                  <span>{story.author_name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
