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
  { id: 'diagram', label: 'Схемы', icon: 'mindMap', href: '/diagram' },
  { id: 'ontology', label: 'Онтологии', icon: 'layout_tree', href: '/ontology' },
  { id: 'funnel', label: 'Воронки', icon: 'filter', href: '/funnel' },
  { id: 'kanban', label: 'Канбан доски', icon: 'clipboard', href: '/kanban' },
];
export const HeaderMenuAdmin: HeaderMenuItem[] = [
  { id: 'template-diagram', label: 'Шаблоны схем', icon: 'mindMap', href: '/admin/template-diagram' },
  { id: 'template-ontology', label: 'Шаблоны онтологий', icon: 'layout_tree', href: '/admin/template-ontology' },
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
    title: 'Схемы',
    description: 'Визуализация данных с помощью различных типов графиков и схем для анализа информации',
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
    description: 'Создание нового аккаунта в системе с заполнением основных данных',
  },
  templateDiagram: {
    title: 'Шаблоны схем',
    description: 'Страница администрирования шаблонов для формульных диаграмм',
  },
  templateOntology: {
    title: 'Шаблоны онтологий',
    description: 'Страница администрирования шаблонов онтологий',
  },

}
