/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Image as ImageIcon, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Trash2,
  BookOpen,
  LayoutDashboard,
  AlertTriangle,
  Settings,
  Edit,
  List,
  ArrowLeft,
  File as FileIcon,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge, 
  useToast,
  Modal,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/src/components/ui';
import { CATEGORIES, TAGS, ADMIN_EMAIL } from '@/src/constants';
import { Story, Chapter, AppNotification, StoryStatus } from '@/src/types';
import { 
  createStory, 
  createChapter, 
  getStories, 
  updateStory, 
  deleteStory, 
  getChapters, 
  updateChapter, 
  deleteChapter,
  getLibraryUsers,
  createNotification
} from '@/src/services/workService';
import { uploadFile } from '@/src/services/supabaseStorageService';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/src/utils';
import { getFriendlyErrorMessage } from '@/src/utils/supabaseErrors';

export function AdminStudio() {
  const { user, loading, authError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'manage'>('create');
  const [stories, setStories] = useState<Story[]>([]);
  const [editingWork, setEditingWork] = useState<Story | null>(null);
  const [managingChapters, setManagingChapters] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isEditingChapter, setIsEditingChapter] = useState<Chapter | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState<Story | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'story' | 'chapter'; id: string; title: string }>({ 
    isOpen: false, 
    type: 'story', 
    id: '', 
    title: '' 
  });

  // Form State
  const [workType, setWorkType] = useState<string>('MANHWA');
  const [coverUrl, setCoverUrl] = useState('');
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [status, setStatus] = useState<StoryStatus>('ongoing');
  const [authorName, setAuthorName] = useState('');
  const [totalChapters, setTotalChapters] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [chaptersData, setChaptersData] = useState<{ chapter_number: number; title: string; cover_url: string; content: string }[]>([]);

  // Coming Soon State
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const handleFileUpload = async (file: File, path: string, callback: (url: string) => void, progressKey?: string) => {
    const key = progressKey || path;
    
    // Supabase Free Tier Storage Limit is 50MB per file
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      toast('El archivo es demasiado grande (máx 50MB en plan gratuito)', 'error');
      return;
    }

    try {
      const url = await uploadFile(file, path, (progress) => {
        setUploadProgress(prev => ({ ...prev, [key]: progress }));
      });
      callback(url);
      setUploadProgress(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      const isPdf = file.type === 'application/pdf';
      toast(isPdf ? 'PDF subido con éxito' : 'Imagen subida con éxito', 'success');
    } catch (error: any) {
      console.error('Error al subir el archivo:', error);
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast(`Error al subir: ${friendlyMessage}`, 'error');
    }
  };

  useEffect(() => {
    if (!loading && user?.email !== ADMIN_EMAIL) {
      navigate('/');
    }
    if (!loading && user?.email === ADMIN_EMAIL) {
      loadStories();
    }
  }, [user, loading, navigate]);

  const loadStories = async () => {
    try {
      const data = await getStories();
      if (data) setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const loadChapters = async (workId: string) => {
    try {
      const data = await getChapters(workId);
      if (data) setChapters(data);
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  useEffect(() => {
    if (managingChapters) {
      loadChapters(managingChapters.id);
    }
  }, [managingChapters]);

  useEffect(() => {
    if (editingWork) {
      setCoverUrl(editingWork.cover_url);
      setTitle(editingWork.title);
      setSynopsis(editingWork.description);
      setStatus(editingWork.status);
      setSelectedCategories([editingWork.category]);
      setAuthorName(editingWork.author_name || '');
      setStep(1);
      setViewMode('create');
    }
  }, [editingWork]);

  useEffect(() => {
    // Initialize chapters data when totalChapters changes
    if (!editingWork) {
      const newChapters = Array.from({ length: totalChapters }).map((_, i) => ({
        chapter_number: i + 1,
        title: `Capítulo ${i + 1}`,
        cover_url: '',
        content: '',
      }));
      setChaptersData(newChapters);
    }
  }, [totalChapters, editingWork]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" /> Error de Autenticación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{authError}</p>
            <Button className="w-full" onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleChapterTitleSet = (index: number, title: string) => {
    const newChapters = [...chaptersData];
    newChapters[index].title = title;
    setChaptersData(newChapters);
  };

  const handleChapterContentSet = (index: number, content: string) => {
    const newChapters = [...chaptersData];
    newChapters[index].content = content;
    setChaptersData(newChapters);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (editingWork) {
        // Update existing story
        await updateStory(editingWork.id, {
          title,
          description: synopsis,
          status: status,
          cover_url: coverUrl,
          author_name: authorName || user?.displayName || 'Admin',
          category: selectedCategories[0] || 'General',
          likes: editingWork.likes,
          created_at: editingWork.created_at,
        });
        toast('¡Historia actualizada con éxito!', 'success');
      } else {
        // Create new story
        const story = await createStory({
          title,
          description: synopsis,
          status: status,
          cover_url: coverUrl,
          author_name: authorName || user?.displayName || 'Admin',
          category: selectedCategories[0] || 'General',
          likes: 0,
          created_at: new Date().toISOString(),
        });

        if (story) {
          // Create chapters
          await Promise.all(chaptersData.map((chapter, index) => 
            createChapter({
              story_id: story.id,
              chapter_number: index + 1,
              title: chapter.title,
              content: chapter.content
            })
          ));
        }
        toast('¡Historia publicada con éxito!', 'success');
      }
      
      loadStories();
      resetForm();
      setViewMode('manage');
    } catch (error) {
      console.error('Error al procesar la historia:', error);
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast(`Error al procesar la historia: ${friendlyMessage}`, 'error');
    } finally {
      setIsPublishing(false);
      setShowAnalysisModal(false);
    }
  };

  const resetForm = () => {
    setEditingWork(null);
    setStep(1);
    setWorkType('MANHWA');
    setCoverUrl('');
    setTitle('');
    setAuthorName('');
    setSynopsis('');
    setStatus('ongoing');
    setTotalChapters(1);
    setSelectedCategories([]);
    setSelectedTags([]);
    setChaptersData([]);
    setIsComingSoon(false);
    setReleaseDate('');
  };

  const handleDeleteStory = (story: Story) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'story',
      id: story.id,
      title: story.title
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    
    try {
      if (deleteConfirm.type === 'story') {
        await deleteStory(deleteConfirm.id);
        toast('Historia eliminada', 'success');
        loadStories();
      } else {
        await deleteChapter(deleteConfirm.id);
        toast('Capítulo eliminado', 'success');
        if (managingChapters) loadChapters(managingChapters.id);
      }
    } catch (error) {
      toast(`Error al eliminar ${deleteConfirm.type === 'story' ? 'historia' : 'capítulo'}`, 'error');
    } finally {
      setDeleteConfirm({ ...deleteConfirm, isOpen: false });
    }
  };

  const handleAddChapter = async () => {
    if (!isAddingChapter) return;
    const story = isAddingChapter;
    const chapter_number = (chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_number)) : 0) + 1;
    const title = newChapterTitle || `Capítulo ${chapter_number}`;

    try {
      await createChapter({
        story_id: story.id,
        chapter_number,
        title,
        content: newChapterContent
      });
      
      // Notify users
      const userIds = await getLibraryUsers(story.id);
      await Promise.all(userIds.map(uid => 
        createNotification({
          user_id: uid,
          title: '¡Nuevo Capítulo!',
          message: `Se ha publicado el ${title} de ${story.title}`,
          type: 'info',
          link: `/story/${story.id}`
        })
      ));

      toast('Capítulo agregado y usuarios notificados', 'success');
      setNewChapterTitle('');
      setNewChapterContent('');
      setIsAddingChapter(null);
      loadChapters(story.id);
      
      loadStories();
    } catch (error) {
      console.error('Error al añadir capítulo:', error);
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast(`Error al añadir capítulo: ${friendlyMessage}`, 'error');
    }
  };

  const handleDeleteChapter = (chapter: Chapter) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'chapter',
      id: chapter.id,
      title: `Capítulo ${chapter.chapter_number}`
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paso 1: Tipo de Obra y Portada</h2>
            <div className="grid grid-cols-3 gap-4">
              {(['COMIC', 'MANGA', 'MANHWA'] as string[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkType(type)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all",
                    workType === type ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <BookOpen className="h-8 w-8" />
                  <span className="font-bold">{type}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Portada Principal</label>
              <div className="flex gap-4">
                <div className="h-48 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 relative">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  {uploadProgress['main-cover'] !== undefined && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold">
                      {Math.round(uploadProgress['main-cover'])}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Subir desde mi equipo</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const path = `covers/${Date.now()}-${file.name}`;
                            handleFileUpload(file, path, setCoverUrl, 'main-cover');
                          }
                        }}
                      />
                      <Button variant="outline" className="w-full gap-2">
                        <Upload className="h-4 w-4" /> Seleccionar Archivo
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">O usar URL</span>
                    </div>
                  </div>
                  <Input 
                    placeholder="https://ejemplo.com/portada.jpg" 
                    value={coverUrl} 
                    onChange={(e) => setCoverUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paso 2: Título y Sinopsis</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Título de la Obra</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título épico..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Nombre del Autor</label>
                <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Nombre del autor original..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Pequeña Sinopsis</label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="De qué trata esta historia..."
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paso 3: Estado y Capítulos</h2>
            <div className="grid grid-cols-2 gap-4">
              {(['ongoing', 'completed', 'hiatus'] as StoryStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all",
                    status === s ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <span className="font-bold capitalize">{s}</span>
                </button>
              ))}
            </div>
            
            <div className="space-y-4">

              <div className="max-h-[400px] overflow-y-auto space-y-4 rounded-xl border border-slate-100 p-4">
                {chaptersData.map((chapter, idx) => (
                  <div key={idx} className="flex flex-col gap-4 rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-indigo-600">Capítulo {chapter.chapter_number}</h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold">Título del Capítulo</label>
                      <Input 
                        value={chapter.title} 
                        onChange={(e) => handleChapterTitleSet(idx, e.target.value)} 
                        placeholder="Título..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold">Contenido del Capítulo</label>
                      <textarea
                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={10}
                        value={chapter.content}
                        onChange={(e) => handleChapterContentSet(idx, e.target.value)}
                        placeholder="Escribe el contenido aquí..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paso 4: Categorías y Etiquetas</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Categorías</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                        selectedCategories.includes(cat) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Etiquetas</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                        selectedTags.includes(tag) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Paso Final: Publicación</h2>
            <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-6 text-center">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-indigo-600" />
              <h3 className="mb-2 text-xl font-bold">¿Listo para publicar?</h3>
              <p className="text-slate-600">
                Has configurado "{title}" como {status.replace('_', ' ')}.
              </p>
              
              {status === 'EN_EMISION' && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm font-bold">¿Quieres agregar esta obra en próximamente o publicarla de una vez?</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => { setIsComingSoon(true); setShowConfirmModal(true); }}>
                      Próximamente
                    </Button>
                    <Button onClick={() => setShowConfirmModal(true)}>
                      Publicar ahora
                    </Button>
                  </div>
                </div>
              )}

              {status === 'FINALIZADO' && (
                <div className="mt-6">
                  <Button size="lg" onClick={() => setShowConfirmModal(true)}>
                    Revisar y Publicar
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">MANGAVERSE Studio</h1>
              <p className="text-slate-500">Panel de Administración</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'create' ? 'default' : 'outline'} 
              onClick={() => { setViewMode('create'); resetForm(); }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> {editingWork ? 'Editando' : 'Crear'}
            </Button>
            <Button 
              variant={viewMode === 'manage' ? 'default' : 'outline'} 
              onClick={() => setViewMode('manage')}
              className="gap-2"
            >
              <Settings className="h-4 w-4" /> Gestionar
            </Button>
          </div>
        </div>

        {viewMode === 'create' ? (
          <Card className="overflow-hidden border-none shadow-xl">
            <CardContent className="p-8">
              {renderStep()}

              <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(prev => Math.max(1, prev - 1))}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                {step < 5 ? (
                  <Button 
                    onClick={() => setStep(prev => Math.min(5, prev + 1))}
                    className="gap-2"
                    disabled={step === 1 && !coverUrl}
                  >
                    Siguiente <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {managingChapters ? (
              <div className="space-y-4">
                <Button variant="ghost" onClick={() => setManagingChapters(null)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Volver a Obras
                </Button>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Gestionar Capítulos: {managingChapters.title}</CardTitle>
                      <p className="text-sm text-slate-500">{chapters.length} capítulos publicados</p>
                    </div>
                    <Button onClick={() => {
                      const chapterNumber = (chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_number)) : 0) + 1;
                      setNewChapterTitle(`Capítulo ${chapterNumber}`);
                      setIsAddingChapter(managingChapters);
                    }} className="gap-2">
                      <Plus className="h-4 w-4" /> Nuevo Capítulo
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {chapters.map(chapter => (
                        <div key={chapter.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50">
                          <div className="flex items-center gap-4">
                            <img src={managingChapters.cover_url} className="h-12 w-8 rounded object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold">Capítulo {chapter.chapter_number}</p>
                              <p className="text-xs text-slate-500">{chapter.title}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEditingChapter(chapter)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteChapter(chapter)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="grid gap-4">
                {stories.map(story => (
                  <Card key={story.id} className="overflow-hidden">
                    <div className="flex">
                      <img src={story.cover_url} className="h-32 w-24 object-cover" referrerPolicy="no-referrer" />
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">{story.title}</h3>
                            <Badge>{story.status}</Badge>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1">{story.description}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setManagingChapters(story)} className="gap-2">
                            <List className="h-4 w-4" /> Capítulos
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingWork(story)} className="gap-2">
                            <Edit className="h-4 w-4" /> Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteStory(story)}>
                            <Trash2 className="h-4 w-4" /> Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Chapter Modal */}
      <Modal
        isOpen={!!isAddingChapter}
        onClose={() => {
          setIsAddingChapter(null);
          setNewChapterTitle('');
          setNewChapterContent('');
        }}
        title="Añadir Nuevo Capítulo"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold">Título del Capítulo</label>
            <Input 
              value={newChapterTitle} 
              onChange={(e) => setNewChapterTitle(e.target.value)} 
              placeholder="Ej: Capítulo 1: El Comienzo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Contenido del Capítulo</label>
            <textarea
              className="w-full h-64 p-3 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700"
              value={newChapterContent}
              onChange={(e) => setNewChapterContent(e.target.value)}
              placeholder="Escribe aquí el contenido de tu capítulo..."
            />
          </div>

          <Button 
            className="w-full" 
            onClick={handleAddChapter}
            disabled={!newChapterTitle || !newChapterContent}
          >
            Crear Capítulo
          </Button>
        </div>
      </Modal>

      {/* Edit Chapter Modal */}
      <Modal
        isOpen={!!isEditingChapter}
        onClose={() => setIsEditingChapter(null)}
        title={`Editando Capítulo ${isEditingChapter?.chapter_number}`}
      >
        {isEditingChapter && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Título del Capítulo</label>
              <Input 
                value={isEditingChapter.title} 
                onChange={(e) => setIsEditingChapter({...isEditingChapter, title: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Contenido del Capítulo</label>
              <textarea
                className="w-full h-64 p-3 rounded-lg border border-slate-300 dark:bg-slate-800 dark:border-slate-700"
                value={isEditingChapter.content}
                onChange={(e) => setIsEditingChapter({...isEditingChapter, content: e.target.value})}
                placeholder="Escribe aquí el contenido de tu capítulo..."
              />
            </div>
            <Button className="w-full" onClick={async () => {
              try {
                await updateChapter(isEditingChapter.id, isEditingChapter);
                toast('Capítulo actualizado', 'success');
                setIsEditingChapter(null);
                if (managingChapters) loadChapters(managingChapters.id);
              } catch (error) {
                console.error('Error al actualizar capítulo:', error);
                const friendlyMessage = getFriendlyErrorMessage(error);
                toast(`Error al actualizar: ${friendlyMessage}`, 'error');
              }
            }}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Publicación"
      >
        <div className="space-y-6">
          <div className="flex gap-4">
            <img src={coverUrl} className="h-32 w-24 rounded-lg object-cover" referrerPolicy="no-referrer" />
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{synopsis}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="default">{workType}</Badge>
                <Badge variant="secondary">{status}</Badge>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="h-4 w-4" /> Nota Importante
            </div>
            <p>
              Al publicar, la obra aparecerá en el Home y en la búsqueda. Solo aparecerá tu nombre de autor, los usuarios no podrán ver tu perfil.
            </p>
          </div>

          {isComingSoon && (
            <div className="space-y-2">
              <label className="text-sm font-bold">Fecha de Lanzamiento</label>
              <Input type="datetime-local" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>No, volver</Button>
            <Button onClick={() => { setShowConfirmModal(false); setShowAnalysisModal(true); }}>
              Sí, Publicar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Analysis Modal */}
      <Modal
        isOpen={showAnalysisModal}
        onClose={() => !isPublishing && setShowAnalysisModal(false)}
        title="Analizando Obra..."
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">LA OBRA ESTÁ LISTA PARA PUBLICAR</h3>
            <div className="mx-auto h-48 w-32 overflow-hidden rounded-xl shadow-lg">
              <img src={coverUrl} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left space-y-1 text-sm">
              <p><strong>Nombre:</strong> {title}</p>
              <p><strong>Estado:</strong> {isComingSoon ? 'Próximamente' : status}</p>
              <p><strong>Capítulos:</strong> {totalChapters}</p>
              <p><strong>Tipo:</strong> {workType}</p>
              <p><strong>Etiquetas:</strong> {selectedTags.join(', ')}</p>
              <p><strong>Categorías:</strong> {selectedCategories.join(', ')}</p>
              <p><strong>Autor:</strong> {user?.displayName}</p>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publicando...' : 'Listo para publicar'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
        title="Confirmar Eliminación"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">¿Estás completamente seguro?</h3>
            <p className="text-slate-500">
              Estás a punto de eliminar <span className="font-bold text-slate-900">"{deleteConfirm.title}"</span>. 
              {deleteConfirm.type === 'story' ? ' Esta acción borrará permanentemente la historia y todos sus capítulos asociados.' : ' Esta acción no se puede deshacer.'}
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setDeleteConfirm({ ...deleteConfirm, isOpen: false })}
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
