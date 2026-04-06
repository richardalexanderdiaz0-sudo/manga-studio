import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        discover: 'Discover',
        donation: 'Donation',
        library: 'My Library',
        settings: 'Settings',
        admin: 'Admin Panel',
        comics: 'Comics & Manhwas',
        finished: 'Finished',
        login: 'Sign In',
        logout: 'Sign Out'
      },
      home: {
        heroTitle: 'Explore the best Manhwas and Comics',
        heroSubtitle: 'Dive into epic stories, romance and action. Only here, at MANGAVERSE.',
        featured: 'FEATURED',
        startReading: 'Start reading',
        viewCatalog: 'View catalog',
        recent: 'RECENTLY ADDED',
        comingSoon: 'COMING SOON',
        dailyUpdates: 'DAILY UPDATES',
        trending: 'TRENDING TITLES',
        finished: 'FINISHED TITLES'
      },
      settings: {
        title: 'Settings & Privacy',
        editProfile: 'Edit Profile',
        displayName: 'Display Name',
        photoUrl: 'Photo URL',
        save: 'Save Changes',
        preferences: 'App Preferences',
        notifications: 'Notifications',
        darkMode: 'Dark Mode',
        privateLibrary: 'Private Library',
        language: 'Language',
        support: 'Support & Feedback',
        sendFeedback: 'Send Feedback',
        legal: 'Terms & Privacy',
        account: 'Account Actions',
        deleteAccount: 'Delete Account'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        discover: 'Descubre',
        donation: 'Donación',
        library: 'Mi Biblioteca',
        settings: 'Ajustes',
        admin: 'Panel de Admin',
        comics: 'Cómics y Manhwas',
        finished: 'Terminados',
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión'
      },
      home: {
        heroTitle: 'Explora los mejores Manhwas y Cómics',
        heroSubtitle: 'Sumérgete en historias épicas, romance y acción. Solo aquí, en MANGAVERSE.',
        featured: 'DESTACADO',
        startReading: 'Comenzar a leer',
        viewCatalog: 'Ver catálogo',
        recent: 'AÑADIDOS RECIENTEMENTE',
        comingSoon: 'PRÓXIMAMENTE',
        dailyUpdates: 'ACTUALIZACIONES DIARIAS',
        trending: 'TÍTULOS EN TENDENCIA',
        finished: 'TERMINADOS'
      },
      settings: {
        title: 'Configuración y Privacidad',
        editProfile: 'Editar Perfil',
        displayName: 'Nombre de usuario',
        photoUrl: 'URL de foto',
        save: 'Guardar Cambios',
        preferences: 'Preferencias de la App',
        notifications: 'Notificaciones',
        darkMode: 'Modo Oscuro',
        privateLibrary: 'Biblioteca Privada',
        language: 'Idioma',
        support: 'Soporte y Feedback',
        sendFeedback: 'Enviar Feedback',
        legal: 'Términos y Privacidad',
        account: 'Acciones de Cuenta',
        deleteAccount: 'Eliminar Cuenta'
      }
    }
  },
  'pt-BR': {
    translation: {
      nav: {
        home: 'Início',
        discover: 'Descobrir',
        donation: 'Doação',
        library: 'Minha Biblioteca',
        settings: 'Configurações',
        admin: 'Painel Admin',
        comics: 'Quadrinhos e Manhwas',
        finished: 'Finalizados',
        login: 'Entrar',
        logout: 'Sair'
      },
      home: {
        heroTitle: 'Explore os melhores Manhwas e Quadrinhos',
        heroSubtitle: 'Mergulhe em histórias épicas, romance e ação. Só aqui, no MANGAVERSE.',
        featured: 'DESTAQUE',
        startReading: 'Começar a ler',
        viewCatalog: 'Ver catálogo',
        recent: 'ADICIONADOS RECENTEMENTE',
        comingSoon: 'EM BREVE',
        dailyUpdates: 'ATUALIZAÇÕES DIÁRIAS',
        trending: 'TÍTULOS EM TENDÊNCIA',
        finished: 'FINALIZADOS'
      },
      settings: {
        title: 'Configurações e Privacidade',
        editProfile: 'Editar Perfil',
        displayName: 'Nome de Exibição',
        photoUrl: 'URL da Foto',
        save: 'Salvar Alterações',
        preferences: 'Preferências do App',
        notifications: 'Notificações',
        darkMode: 'Modo Escuro',
        privateLibrary: 'Biblioteca Privada',
        language: 'Idioma',
        support: 'Suporte e Feedback',
        sendFeedback: 'Enviar Feedback',
        legal: 'Termos e Privacidade',
        account: 'Ações da Conta',
        deleteAccount: 'Excluir Conta'
      }
    }
  },
  pt: {
    translation: {
      nav: {
        home: 'Início',
        discover: 'Descobrir',
        donation: 'Doação',
        library: 'Minha Biblioteca',
        settings: 'Definições',
        admin: 'Painel Admin',
        comics: 'Banda Desenhada e Manhwas',
        finished: 'Concluídos',
        login: 'Entrar',
        logout: 'Sair'
      },
      home: {
        heroTitle: 'Explore a melhor Banda Desenhada e Manhwas',
        heroSubtitle: 'Mergulhe em histórias épicas, romance e ação. Só aqui, no MANGAVERSE.',
        featured: 'DESTAQUE',
        startReading: 'Começar a ler',
        viewCatalog: 'Ver catálogo',
        recent: 'ADICIONADOS RECENTEMENTE',
        comingSoon: 'BREVEMENTE',
        dailyUpdates: 'ATUALIZAÇÕES DIÁRIAS',
        trending: 'TÍTULOS EM TENDÊNCIA',
        finished: 'CONCLUÍDOS'
      },
      settings: {
        title: 'Definições e Privacidade',
        editProfile: 'Editar Perfil',
        displayName: 'Nome de Exibição',
        photoUrl: 'URL da Foto',
        save: 'Guardar Alterações',
        preferences: 'Preferências da App',
        notifications: 'Notificações',
        darkMode: 'Modo Escuro',
        privateLibrary: 'Biblioteca Privada',
        language: 'Idioma',
        support: 'Suporte e Feedback',
        sendFeedback: 'Enviar Feedback',
        legal: 'Termos e Privacidade',
        account: 'Ações da Conta',
        deleteAccount: 'Eliminar Conta'
      }
    }
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        discover: 'Обзор',
        donation: 'Донат',
        library: 'Моя Библиотека',
        settings: 'Настройки',
        admin: 'Панель Админа',
        comics: 'Комиксы и Манхвы',
        finished: 'Завершено',
        login: 'Войти',
        logout: 'Выйти'
      },
      home: {
        heroTitle: 'Исследуйте лучшие Манхвы и Комиксы',
        heroSubtitle: 'Погрузитесь в эпические истории, романтику и экшн. Только здесь, в MANGAVERSE.',
        featured: 'РЕКОМЕНДУЕМОЕ',
        startReading: 'Начать читать',
        viewCatalog: 'Каталог',
        recent: 'НЕДАВНО ДОБАВЛЕННЫЕ',
        comingSoon: 'СКОРО',
        dailyUpdates: 'ЕЖЕДНЕВНЫЕ ОБНОВЛЕНИЯ',
        trending: 'ПОПУЛЯРНЫЕ',
        finished: 'ЗАВЕРШЕННЫЕ'
      },
      settings: {
        title: 'Настройки и Конфиденциальность',
        editProfile: 'Редактировать Профиль',
        displayName: 'Имя пользователя',
        photoUrl: 'URL фото',
        save: 'Сохранить изменения',
        preferences: 'Настройки Приложения',
        notifications: 'Уведомления',
        darkMode: 'Темная Тема',
        privateLibrary: 'Приватная Библиотека',
        language: 'Язык',
        support: 'Поддержка и Отзывы',
        sendFeedback: 'Отправить отзыв',
        legal: 'Условия и Конфиденциальность',
        account: 'Действия с Аккаунтом',
        deleteAccount: 'Удалить Аккаунт'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        discover: '发现',
        donation: '捐赠',
        library: '我的书架',
        settings: '设置',
        admin: '管理面板',
        comics: '漫画与韩漫',
        finished: '已完结',
        login: '登录',
        logout: '退出登录'
      },
      home: {
        heroTitle: '探索最棒的韩漫与漫画',
        heroSubtitle: '沉浸在史诗故事、浪漫与动作中。尽在 MANGAVERSE。',
        featured: '精选',
        startReading: '开始阅读',
        viewCatalog: '查看目录',
        recent: '最近添加',
        comingSoon: '即将推出',
        dailyUpdates: '每日更新',
        trending: '热门排行',
        finished: '已完结'
      },
      settings: {
        title: '设置与隐私',
        editProfile: '编辑个人资料',
        displayName: '显示名称',
        photoUrl: '头像 URL',
        save: '保存更改',
        preferences: '应用偏好',
        notifications: '通知',
        darkMode: '深色模式',
        privateLibrary: '私人书架',
        language: '语言',
        support: '支持与反馈',
        sendFeedback: '发送反馈',
        legal: '条款与隐私',
        account: '账户操作',
        deleteAccount: '注销账户'
      }
    }
  },
  ko: {
    translation: {
      nav: {
        home: '홈',
        discover: '탐색',
        donation: '후원',
        library: '내 서재',
        settings: '설정',
        admin: '관리자 패널',
        comics: '만화 및 웹툰',
        finished: '완결',
        login: '로그인',
        logout: '로그아웃'
      },
      home: {
        heroTitle: '최고의 웹툰과 만화를 탐색하세요',
        heroSubtitle: '서사적인 이야기, 로맨스, 액션에 빠져보세요. 오직 MANGAVERSE에서만.',
        featured: '추천',
        startReading: '읽기 시작',
        viewCatalog: '카탈로그 보기',
        recent: '최근 추가됨',
        comingSoon: '출시 예정',
        dailyUpdates: '일일 업데이트',
        trending: '인기 작품',
        finished: '완결 작품'
      },
      settings: {
        title: '설정 및 개인정보',
        editProfile: '프로필 편집',
        displayName: '표시 이름',
        photoUrl: '사진 URL',
        save: '변경사항 저장',
        preferences: '앱 설정',
        notifications: '알림',
        darkMode: '다크 모드',
        privateLibrary: '비공개 서재',
        language: '언어',
        support: '지원 및 피드백',
        sendFeedback: '피드백 보내기',
        legal: '약관 및 개인정보',
        account: '계정 작업',
        deleteAccount: '계정 삭제'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        discover: 'Découvrir',
        donation: 'Don',
        library: 'Ma Bibliothèque',
        settings: 'Paramètres',
        admin: 'Panel Admin',
        comics: 'Comics & Manhwas',
        finished: 'Terminé',
        login: 'Connexion',
        logout: 'Déconnexion'
      },
      home: {
        heroTitle: 'Explorez les meilleurs Manhwas et Comics',
        heroSubtitle: 'Plongez dans des histoires épiques, de la romance et de l\'action. Seulement ici, sur MANGAVERSE.',
        featured: 'EN VEDETTE',
        startReading: 'Commencer à lire',
        viewCatalog: 'Voir le catalogue',
        recent: 'RÉCEMMENT AJOUTÉS',
        comingSoon: 'BIENTÔT DISPONIBLE',
        dailyUpdates: 'MISES À JOUR QUOTIDIENNES',
        trending: 'TITRES TENDANCES',
        finished: 'TITRES TERMINÉS'
      },
      settings: {
        title: 'Paramètres & Confidentialité',
        editProfile: 'Modifier le Profil',
        displayName: 'Nom d\'affichage',
        photoUrl: 'URL de la Photo',
        save: 'Enregistrer',
        preferences: 'Préférences de l\'App',
        notifications: 'Notifications',
        darkMode: 'Mode Sombre',
        privateLibrary: 'Bibliothèque Privée',
        language: 'Langue',
        support: 'Support & Feedback',
        sendFeedback: 'Envoyer un Feedback',
        legal: 'Conditions & Confidentialité',
        account: 'Actions du Compte',
        deleteAccount: 'Supprimer le Compte'
      }
    }
  },
  id: {
    translation: {
      nav: {
        home: 'Beranda',
        discover: 'Jelajah',
        donation: 'Donasi',
        library: 'Perpustakaanku',
        settings: 'Pengaturan',
        admin: 'Panel Admin',
        comics: 'Komik & Manhwa',
        finished: 'Selesai',
        login: 'Masuk',
        logout: 'Keluar'
      },
      home: {
        heroTitle: 'Jelajahi Manhwa dan Komik terbaik',
        heroSubtitle: 'Selami kisah epik, romansa, dan aksi. Hanya di sini, di MANGAVERSE.',
        featured: 'UNGGULAN',
        startReading: 'Mulai membaca',
        viewCatalog: 'Lihat katalog',
        recent: 'BARU DITAMBAHKAN',
        comingSoon: 'SEGERA HADIR',
        dailyUpdates: 'PEMBARUAN HARIAN',
        trending: 'JUDUL TREN',
        finished: 'JUDUL SELESAI'
      },
      settings: {
        title: 'Pengaturan & Privasi',
        editProfile: 'Edit Profil',
        displayName: 'Nama Tampilan',
        photoUrl: 'URL Foto',
        save: 'Simpan Perubahan',
        preferences: 'Preferensi Aplikasi',
        notifications: 'Notifikasi',
        darkMode: 'Mode Gelap',
        privateLibrary: 'Perpustakaan Pribadi',
        language: 'Bahasa',
        support: 'Dukungan & Umpan Balik',
        sendFeedback: 'Kirim Umpan Balik',
        legal: 'Ketentuan & Privasi',
        account: 'Tindakan Akun',
        deleteAccount: 'Hapus Akun'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
