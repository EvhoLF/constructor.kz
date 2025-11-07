import { HeaderMenuItem } from "@/types/pages";

export const MENU_CONFIG: HeaderMenuItem[] = [
  { id: 'main', label: 'Главная', icon: 'home', href: '/' },
  // { id: 'divider-before-profile', label: '', icon: 'home', href: '', isDivider: true },
  // { id: 'profile', label: 'Профиль', icon: 'user', href: '/profile' },
  { id: 'diagram', label: 'Диаграмм', icon: 'mindMap', href: '/diagram' },
  { id: 'ontology', label: 'Онтологии', icon: 'layout_tree', href: '/ontology' },
  { id: 'funnel', label: 'Воронки', icon: 'filter', href: '/funnel' },
  { id: 'kanban', label: 'Канбан доски', icon: 'clipboard', href: '/kanban' },
  { id: 'divider-admin', label: 'Админ', icon: 'home', href: '', isDivider: true, dividerLabel: 'Админ', adminOnly: true },
  { id: 'create-user', label: 'Создать пользователя', icon: 'userAdd', href: '/admin/user-create', adminOnly: true },
  { id: 'template-diagram', label: 'Шаблоны диаграмм', icon: 'mindMap', href: '/admin/template-diagram', adminOnly: true },
  { id: 'template-ontology', label: 'Шаблоны онтологий', icon: 'layout_tree', href: '/admin/template-ontology', adminOnly: true },
  { id: 'divider-admin', label: 'Тема', icon: 'home', href: '', isDivider: true, dividerLabel: 'Тема' },
];

// Вспомогательные функции для работы с меню
export const getMenuItems = (isAdmin: boolean = false): HeaderMenuItem[] => {
  return MENU_CONFIG.filter(item => {
    if (item.isDivider) {
      const index = MENU_CONFIG.indexOf(item);
      const nextItems = MENU_CONFIG.slice(index + 1);
      return nextItems.some(nextItem =>
        !nextItem.isDivider && (!nextItem.adminOnly || isAdmin)
      );
    }
    return !item.adminOnly || isAdmin;
  });
};

export const getRegularMenuItems = (): HeaderMenuItem[] => {
  return MENU_CONFIG.filter(item => !item.isDivider && !item.adminOnly);
};

export const getAdminMenuItems = (): HeaderMenuItem[] => {
  return MENU_CONFIG.filter(item => !item.isDivider && item.adminOnly);
};

export const PAGE_DATA = {
  home: {
    title: 'Бизнес конструктор',
    description: 'Универсальная платформа для визуализации, анализа и систематизации данных. Создавайте диаграммы, воронки и канбан-доски — всё в одном интуитивном пространстве',
  },
  profile: {
    title: 'Профиль',
    description: 'Управление личными данными, настройками аккаунта и параметрами безопасности',
  },
  diagram: {
    title: 'Диаграммы',
    description: 'Визуализация данных с помощью различных типов графиков и диаграмм для анализа информации',
  },
  ontology: {
    title: 'Онтологии',
    description: 'Создание и редактирование онтологий',
  },
  funnel: {
    title: 'Воронки',
    description: 'Вороноки и пользовательские пути',
  },
  kanban: {
    title: 'Канбан доски',
    description: 'Страница с функционалом канбан-досок',
  },
  icons: {
    title: 'Иконки',
    description: 'Библиотека иконок и графических элементов для использования в интерфейсе',
  },
  authSignIn: {
    title: 'Авторизация',
    description: 'Страница входа в систему для зарегистрированных пользователей',
  },
  authSignUp: {
    title: 'Регистрация',
    description: 'Создание нового аккаунта в системе',
  },
  createUser: {
    title: 'Создание пользователя',
    description: 'Создание нового аккаунта в системе',
  },
  templateDiagram: {
    title: 'Шаблоны диаграмм',
    description: 'Страница администрирования шаблонов для формульных диаграмм',
  },
  templateOntology: {
    title: 'Шаблоны онтологий',
    description: 'Страница администрирования шаблонов онтологий',
  },

}
