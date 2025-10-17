import { IconName } from "@/Icons";

export interface HeaderMenuItem {
  id: string,
  label: string,
  icon: IconName,
  href: string,
}

export const HeaderMenu: HeaderMenuItem[] = [
  { id: 'main', label: 'Главная', icon: 'home', href: '/' },
  { id: 'profile', label: 'Профиль', icon: 'user', href: '/profile' },
  { id: 'diagram', label: 'Диаграмы', icon: 'layout_tree', href: '/diagram' },
  { id: 'diagram-formula', label: 'Диаграмы формулы', icon: 'layout_tree', href: '/diagram-formula' },
  { id: 'funnel', label: 'Воронки', icon: 'filter', href: '/funnel' },
  { id: 'kanban', label: 'Канбан доски', icon: 'clipboard', href: '/kanban' },
];
export const HeaderMenuAdmin: HeaderMenuItem[] = [
  { id: 'template-formula', label: 'Шаблоны диаграм формул', icon: 'default', href: '/admin/template-formula' },
  { id: 'template-diagram', label: 'Шаблоны диаграм', icon: 'default', href: '/admin/template-diagram' },
];

export const PAGE_DATA = {
  home: {
    title: 'Главная страница',
    description: 'Обзорная панель с ключевыми метриками и быстрым доступом к основным функциям системы',
  },
  profile: {
    title: 'Профиль',
    description: 'Управление личными данными, настройками аккаунта и параметрами безопасности',
  },
  diagram: {
    title: 'Диаграммы',
    description: 'Визуализация данных с помощью различных типов графиков и диаграмм для анализа информации',
  },
  diagramFormula: {
    title: 'Диаграммы формулы',
    description: 'Создание и редактирование диаграмм на основе формул',
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
    description: 'Создание нового аккаунта в системе с заполнением основных данных',
  },
  templateDiagram: {
    title: 'Шаблоны формульных диаграмм',
    description: 'Страница администрирования шаблонов для формульных диаграмм',
  },
  templateFormula: {
    title: 'Шаблоны диаграмм',
    description: 'Страница администрирования шаблонов для формул',
  },

}
