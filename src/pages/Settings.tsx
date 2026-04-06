/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Trash2, 
  Mail, 
  ChevronRight, 
  Moon, 
  Sun, 
  Info, 
  Lock,
  Camera,
  MessageSquare,
  ArrowLeft,
  Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getFriendlyErrorMessage } from '@/src/utils/supabaseErrors';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  useToast,
  Modal,
  Badge
} from '@/src/components/ui';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/src/utils';

export function Settings() {
  const { t, i18n } = useTranslation();
  const { user, signOut, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [privateLibrary, setPrivateLibrary] = useState(true);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'pt', name: 'Português (Portugal)', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLanguageModalOpen(false);
    toast(t('settings.save'), 'success');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    const root = window.document.documentElement;
    if (newDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(displayName, photoURL);
      toast('Perfil actualizado con éxito', 'success');
      setIsEditingProfile(false);
    } catch (error) {
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast(`Error al actualizar el perfil: ${friendlyMessage}`, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast('Cuenta eliminada permanentemente', 'success');
      navigate('/');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast('Por favor, cierra sesión e inicia sesión de nuevo para eliminar tu cuenta por seguridad.', 'error');
      } else {
        const friendlyMessage = getFriendlyErrorMessage(error);
        toast(`Error al eliminar la cuenta: ${friendlyMessage}`, 'error');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast('Sesión cerrada correctamente', 'success');
  };

  const sendFeedback = () => {
    const subject = encodeURIComponent('Feedback de MANGAVERSE');
    const body = encodeURIComponent(`Hola,\n\nQuiero enviar feedback sobre la app:\n\nUsuario: ${user?.displayName}\nEmail: ${user?.email}\n\nComentarios:\n`);
    window.location.href = `mailto:richardalexanderdiaz0@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-32">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('settings.title')}</h1>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border-none shadow-lg overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="bg-white border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <User className="h-5 w-5" /> {t('settings.editProfile')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100 border-2 border-indigo-100 dark:bg-slate-800 dark:border-indigo-900">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg border-2 border-white dark:border-slate-900"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.displayName || 'Usuario'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    {t('settings.editProfile')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="border-none shadow-lg dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="bg-white border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Bell className="h-5 w-5" /> {t('settings.preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t('settings.notifications')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Recibe alertas de nuevos capítulos</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={cn(
                      "h-6 w-11 rounded-full transition-colors relative",
                      notifications ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
                      notifications ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t('settings.darkMode')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Cambia el tema de la aplicación</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={cn(
                      "h-6 w-11 rounded-full transition-colors relative",
                      darkMode ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
                      darkMode ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t('settings.privateLibrary')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Solo tú puedes ver tus obras guardadas</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPrivateLibrary(!privateLibrary)}
                    className={cn(
                      "h-6 w-11 rounded-full transition-colors relative",
                      privateLibrary ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
                      privateLibrary ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>

                <button 
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                      <Languages className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 dark:text-white">{t('settings.language')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {languages.find(l => l.code === i18n.language.split('-')[0] || l.code === i18n.language)?.name || 'Español'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Support & Privacy */}
          <Card className="border-none shadow-lg dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="bg-white border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Shield className="h-5 w-5" /> {t('settings.support')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <button 
                  onClick={sendFeedback}
                  className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 dark:text-white">{t('settings.sendFeedback')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Ayúdanos a mejorar MANGAVERSE</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </button>

                <button 
                  onClick={() => navigate('/legal')}
                  className="flex w-full items-center justify-between p-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                      <Info className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 dark:text-white">{t('settings.legal')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Políticas legales de la plataforma</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full gap-2 border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" /> {t('nav.logout')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 dark:border-red-900/30 dark:text-red-500 dark:hover:bg-red-950/20"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-5 w-5" /> {t('settings.deleteAccount')}
            </Button>
          </div>

          <div className="text-center pt-8">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">MANGAVERSE v1.2.0</p>
            <p className="text-[10px] text-slate-300 mt-1">Hecho con ❤️ para lectores</p>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      <Modal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        title={t('settings.language')}
      >
        <div className="grid grid-cols-1 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                "flex items-center justify-between rounded-xl p-4 transition-all",
                (i18n.language.split('-')[0] === lang.code || i18n.language === lang.code)
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-bold">{lang.name}</span>
              </div>
              {(i18n.language.split('-')[0] === lang.code || i18n.language === lang.code) && (
                <div className="h-2 w-2 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        title={t('settings.editProfile')}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.displayName')}</label>
              <Input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Tu nombre..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.photoUrl')}</label>
              <Input 
                value={photoURL} 
                onChange={(e) => setPhotoURL(e.target.value)} 
                placeholder="https://ejemplo.com/foto.jpg"
              />
              <p className="text-[10px] text-slate-400">Pega una URL directa a una imagen (JPG, PNG).</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditingProfile(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-indigo-600" onClick={handleUpdateProfile}>
              {t('settings.save')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Eliminar Cuenta"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">¿Estás completamente seguro?</h3>
            <p className="text-slate-500">
              Esta acción es **irreversible**. Se borrarán todos tus datos, biblioteca y comentarios permanentemente de MANGAVERSE.
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="default" 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar todo'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
