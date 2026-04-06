/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Info, 
  Share2, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Badge, Skeleton, useToast } from '@/src/components/ui';
import { getStoryById, getChapters, addToLibrary } from '@/src/services/workService';
import { Story, Chapter } from '@/src/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/src/utils';

export function Reader() {
  const { storyId, chapterId } = useParams<{ storyId: string, chapterId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!storyId || !chapterId) return;
      try {
        const [storyData, chaptersData] = await Promise.all([
          getStoryById(storyId),
          getChapters(storyId),
        ]);
        setStory(storyData || null);
        setChapters(chaptersData || []);
        const chapter = chaptersData?.find(c => c.id === chapterId);
        setCurrentChapter(chapter || null);

        // Mark as read
        if (chapter && storyId) {
          const readChapters = JSON.parse(localStorage.getItem(`readChapters_${storyId}`) || '[]');
          if (!readChapters.includes(chapter.id)) {
            readChapters.push(chapter.id);
            localStorage.setItem(`readChapters_${storyId}`, JSON.stringify(readChapters));
          }
        }
      } catch (error) {
        console.error('Error fetching reader data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId, chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      if (showControls) setShowControls(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showControls]);

  const toggleControls = () => setShowControls(!showControls);

  const handleSubscribe = () => {
    if (!user) {
      signIn();
      return;
    }
    setIsSubscribed(!isSubscribed);
    if (!isSubscribed) {
      toast('ENTENDÍDO, RECIBÍRAS UNA NOTIFICACIÓN DE TU CAMPANA CUANDO HAYA UNA NUEVA ACTUALIZACIÓN DE CAPITULO', 'success');
    }
  };

  const handleShare = () => {
    if (!story || !currentChapter) return;
    const shareUrl = window.location.href;
    const shareText = `¡NO DEJO DE LEER ${story.title.toUpperCase()} - CAP ${currentChapter.chapter_number}! TE INVITO A LEER! ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${story.title} - Cap ${currentChapter.chapter_number}`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast('Enlace copiado al portapapeles', 'info');
    }
  };

  const goToChapter = (id: string) => {
    navigate(`/reader/${storyId}/${id}`);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const nextChapter = () => {
    if (!currentChapter) return;
    const next = chapters.find(c => c.chapter_number === currentChapter.chapter_number + 1);
    if (next) goToChapter(next.id);
  };

  const prevChapter = () => {
    if (!currentChapter) return;
    const prev = chapters.find(c => c.chapter_number === currentChapter.chapter_number - 1);
    if (prev) goToChapter(prev.id);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <p className="text-slate-400">Cargando capítulo...</p>
        </div>
      </div>
    );
  }

  if (!story || !currentChapter) {
    return <div className="flex h-screen items-center justify-center">Capítulo no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white" ref={containerRef}>
      {/* Immersive Reader Content */}
      <div className="mx-auto max-w-3xl px-6 py-12" onClick={toggleControls}>
        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-2">{currentChapter.title}</h1>
          <p className="text-slate-400 mb-8">Capítulo {currentChapter.chapter_number}</p>
          <div className="whitespace-pre-wrap leading-relaxed">
            {currentChapter.content}
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-slate-900/90 px-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(`/story/${storyId}`)}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="overflow-hidden">
                <h1 className="line-clamp-1 text-sm font-bold">{story.title}</h1>
                <p className="text-xs text-slate-400">Capítulo {currentChapter.chapter_number}: {currentChapter.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("text-white", isSubscribed && "text-red-500")}
                onClick={(e) => { e.stopPropagation(); handleSubscribe(); }}
              >
                <Heart className={cn("h-6 w-6", isSubscribed && "fill-current")} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white" onClick={(e) => { e.stopPropagation(); navigate(`/story/${storyId}`); }}>
                <Info className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white" onClick={(e) => { e.stopPropagation(); handleShare(); }}>
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-between bg-slate-900/90 px-6 backdrop-blur-md"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white disabled:opacity-30" 
              onClick={(e) => { e.stopPropagation(); prevChapter(); }}
              disabled={currentChapter.chapterNumber === 1}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white" 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
            >
              <Menu className="h-8 w-8" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white disabled:opacity-30" 
              onClick={(e) => { e.stopPropagation(); nextChapter(); }}
              disabled={currentChapter.chapterNumber === chapters.length}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episode List Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <h2 className="text-lg font-bold">Capítulos</h2>
                <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(chapter.id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl p-3 transition-colors",
                      chapter.id === chapterId ? "bg-indigo-600" : "hover:bg-slate-800"
                    )}
                  >
                    <div className="text-left">
                      <p className="font-bold">Capítulo {chapter.chapterNumber}</p>
                      <p className="text-xs text-slate-400">{chapter.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
