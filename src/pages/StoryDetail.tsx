/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Share2, 
  MoreVertical, 
  Heart, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { Badge, Button, Skeleton, Card, CardContent, Modal, useToast } from '@/src/components/ui';
import { getStoryById, getChapters, addToLibrary, addReport } from '@/src/services/workService';
import { Story, Chapter } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { formatNumber, cn } from '@/src/utils';
import { getFriendlyErrorMessage } from '@/src/utils/supabaseErrors';
import { AuthModal } from '@/src/components/AuthModal';

export function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMoreSynopsis, setShowMoreSynopsis] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [readChapters, setReadChapters] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [storyData, chaptersData] = await Promise.all([
          getStoryById(id),
          getChapters(id),
        ]);
        setStory(storyData || null);
        setChapters(chaptersData || []);
        
        // Load read chapters
        const storedReadChapters = JSON.parse(localStorage.getItem(`readChapters_${id}`) || '[]');
        setReadChapters(storedReadChapters);
      } catch (error) {
        console.error('Error fetching story detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToLibrary = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!story) return;
    try {
      await addToLibrary(user.uid, story.id);
      toast('Añadido a tu biblioteca', 'success');
    } catch (error) {
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast(`Error al añadir a la biblioteca: ${friendlyMessage}`, 'error');
    }
  };

  const handleShare = () => {
    if (!story || !chapters[0]) return;
    const shareUrl = window.location.href;
    const shareText = `¡NO DEJO DE LEER ${story.title.toUpperCase()}! TE INVITO A LEER! ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast('Enlace copiado al portapapeles', 'info');
    }
  };

  const handleReport = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!story || !reportReason.trim()) return;
    try {
      await addReport({
        story_id: story.id,
        user_id: user.uid,
        reason: reportReason,
      });
      toast('Reporte enviado correctamente', 'success');
      setIsReportModalOpen(false);
      setReportReason('');
    } catch (error) {
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast(`Error al enviar el reporte: ${friendlyMessage}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!story) {
    return <div className="flex h-screen items-center justify-center">Historia no encontrada</div>;
  }

  const sortedChapters = [...chapters].sort((a, b) => 
    sortOrder === 'asc' ? a.chapter_number - b.chapter_number : b.chapter_number - a.chapter_number
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img
          src={story.cover_url}
          alt={story.title}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-950/40 to-transparent dark:from-slate-950" />
        
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="hidden w-48 shrink-0 overflow-hidden rounded-xl shadow-2xl md:block">
              <img src={story.cover_url} alt={story.title} className="aspect-[3/4] w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 text-white">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant={story.status === 'FINALIZADO' ? 'success' : 'warning'}>
                  {story.status === 'FINALIZADO' ? 'FINALIZADO' : 'EN EMISIÓN'}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md">
                  {story.category}
                </Badge>
              </div>
              <h1 className="mb-2 text-4xl font-black tracking-tight sm:text-6xl">{story.title}</h1>
              <p className="mb-4 text-lg font-medium text-slate-300">Por {story.author_name}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-200">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" /> {formatNumber(story.views)} leídos
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" /> {formatNumber(story.likes)}
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> {formatNumber(0)} comentarios
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8 flex items-center gap-4">
              <Button size="lg" className="gap-2" onClick={() => navigate(`/reader/${story.id}/${chapters[0]?.id}`)}>
                <Play className="h-5 w-5 fill-current" /> Leer ahora
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={handleAddToLibrary}>
                <Heart className="h-5 w-5" /> Biblioteca
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setIsReportModalOpen(true)}>
                <Flag className="h-5 w-5" />
              </Button>
            </div>

            <div className="mb-12 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sinopsis</h2>
              <div className={cn(
                "relative text-slate-600 leading-relaxed dark:text-slate-400",
                !showMoreSynopsis && "line-clamp-3"
              )}>
                {story.description}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-indigo-600 hover:text-indigo-700 p-0"
                onClick={() => setShowMoreSynopsis(!showMoreSynopsis)}
              >
                {showMoreSynopsis ? (
                  <span className="flex items-center gap-1">Leer menos <ChevronUp className="h-4 w-4" /></span>
                ) : (
                  <span className="flex items-center gap-1">Leer más <ChevronDown className="h-4 w-4" /></span>
                )}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Episodios ({chapters.length})</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="dark:text-slate-400 dark:hover:text-white"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? 'Primero al último' : 'Último al primero'}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sortedChapters.map((chapter) => (
                  <Link 
                    key={chapter.id} 
                    to={`/reader/${story.id}/${chapter.id}`}
                    className={cn(
                      "group relative flex items-center gap-4 rounded-xl border p-3 transition-all",
                      readChapters.includes(chapter.id) 
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" 
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-200 hover:shadow-md dark:hover:border-indigo-500"
                    )}
                  >
                    {readChapters.includes(chapter.id) && (
                      <Badge className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] px-2 py-0.5">Leído</Badge>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <h3 className="line-clamp-1 font-bold text-slate-900 dark:text-white">Capítulo {chapter.chapter_number}</h3>
                      <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{chapter.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8">
            <Card className="dark:border-slate-800 dark:bg-slate-900">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Autor</h4>
                  <p className="font-semibold text-slate-900 dark:text-white">{story.author_name}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Estado</h4>
                  <Badge variant={story.status === 'FINALIZADO' ? 'success' : 'warning'}>
                    {story.status === 'FINALIZADO' ? 'FINALIZADO' : 'EN EMISIÓN'}
                  </Badge>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Categoría</h4>
                  <Badge variant="outline">{story.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        title="Reportar Historia"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">¿Por qué quieres reportar esta historia?</p>
          <textarea
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Escribe el motivo del reporte..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleReport} disabled={!reportReason.trim()}>
              Enviar Reporte
            </Button>
          </div>
        </div>
      </Modal>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
